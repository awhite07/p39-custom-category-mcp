#!/usr/bin/env bash
# Peer39 MCP server — preflight check.
#
# Verifies the prerequisites needed to run the Peer39 MCP server in Claude
# Desktop, and prints actionable remediation for anything that's missing.
#
# Usage:
#   bash preflight.sh              # interactive (prompts for credentials)
#   PEER39_USERNAME=... PEER39_PASSWORD=... bash preflight.sh
#
# Or pull and run in one step:
#   curl -fsSL https://raw.githubusercontent.com/awhite07/p39-custom-category-mcp/main/scripts/preflight.sh -o /tmp/peer39-preflight.sh
#   bash /tmp/peer39-preflight.sh

set -uo pipefail

if [ -t 1 ]; then
  GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; YELLOW=$'\033[1;33m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  GREEN=''; RED=''; YELLOW=''; BOLD=''; RESET=''
fi

ok()    { printf "  ${GREEN}✓${RESET} %s\n" "$1"; }
fail()  { printf "  ${RED}✗${RESET} %s\n" "$1"; }
warn()  { printf "  ${YELLOW}!${RESET} %s\n" "$1"; }
step()  { printf "\n${BOLD}%s${RESET}\n" "$1"; }
hint()  { printf "      ${YELLOW}→${RESET} %s\n" "$1"; }

FAIL_COUNT=0
note_fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); }

printf "${BOLD}Peer39 MCP — preflight check${RESET}\n"
printf "Verifying everything the MCP server needs before you install it.\n"

###############################################################################
# 1. Operating system
###############################################################################
step "1. Operating system"
OS="$(uname -s)"
case "$OS" in
  Darwin)
    ok "macOS"
    CLAUDE_DIR="$HOME/Library/Application Support/Claude"
    CLAUDE_APP="/Applications/Claude.app"
    ;;
  Linux)
    ok "Linux"
    CLAUDE_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/Claude"
    CLAUDE_APP=""
    ;;
  MINGW*|MSYS*|CYGWIN*)
    ok "Windows (Git Bash / WSL)"
    CLAUDE_DIR="${APPDATA:-$HOME/AppData/Roaming}/Claude"
    CLAUDE_APP=""
    ;;
  *)
    warn "Unknown ($OS) — Claude Desktop may not be supported on this OS"
    CLAUDE_DIR=""
    CLAUDE_APP=""
    note_fail
    ;;
esac
CLAUDE_CONFIG="$CLAUDE_DIR/claude_desktop_config.json"

###############################################################################
# 2. Claude Desktop installed
###############################################################################
step "2. Claude Desktop"
if [ -n "$CLAUDE_APP" ] && [ -e "$CLAUDE_APP" ]; then
  ok "Claude Desktop installed ($CLAUDE_APP)"
elif [ -n "$CLAUDE_DIR" ] && [ -d "$CLAUDE_DIR" ]; then
  ok "Claude Desktop config directory found ($CLAUDE_DIR)"
else
  fail "Claude Desktop not detected"
  hint "Download from https://claude.ai/download"
  hint "Sign in with your Anthropic account, then re-run this script."
  note_fail
fi

###############################################################################
# 3. Node.js 18+
###############################################################################
step "3. Node.js (needed by npx to fetch the MCP server)"
if command -v node >/dev/null 2>&1; then
  NODE_VERSION="$(node --version 2>/dev/null | sed 's/^v//')"
  NODE_MAJOR="$(printf '%s' "$NODE_VERSION" | cut -d. -f1)"
  if [ "${NODE_MAJOR:-0}" -ge 18 ] 2>/dev/null; then
    ok "Node.js v$NODE_VERSION"
  else
    fail "Node.js v$NODE_VERSION found, but v18 or newer is required"
    hint "Upgrade options:"
    hint "  • Homebrew: brew install node"
    hint "  • nvm:      nvm install --lts && nvm use --lts"
    hint "  • Installer: https://nodejs.org/en/download"
    note_fail
  fi
else
  fail "Node.js not found on PATH"
  hint "Install options:"
  hint "  • macOS / Linux (Homebrew): brew install node"
  hint "  • nvm (any OS): https://github.com/nvm-sh/nvm#installing-and-updating"
  hint "  • Official installer: https://nodejs.org/en/download"
  hint "After installing, restart your terminal and re-run this script."
  note_fail
fi

###############################################################################
# 4. npx available
###############################################################################
step "4. npx (ships with Node.js — used to launch the MCP server)"
if command -v npx >/dev/null 2>&1; then
  ok "npx $(npx --version 2>/dev/null || echo found)"
else
  fail "npx not found on PATH"
  hint "npx ships with Node.js — reinstalling Node should fix this."
  note_fail
fi

###############################################################################
# 5. Peer39 credentials
###############################################################################
step "5. Peer39 API credentials"
echo "      You need a Peer39 username with the 'External API' and 'RTB Buyer' roles."
echo "      If you don't have one (or aren't sure), ask your Peer39 integration manager."
echo

USERNAME="${PEER39_USERNAME:-}"
PASSWORD="${PEER39_PASSWORD:-}"

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
  if [ -t 0 ]; then
    printf "      Peer39 username: "
    read -r USERNAME
    printf "      Peer39 password: "
    stty -echo 2>/dev/null
    read -r PASSWORD
    stty echo 2>/dev/null
    printf "\n"
  else
    fail "Credentials not provided and stdin is not a TTY"
    hint "Re-run interactively, or:"
    hint "  PEER39_USERNAME=you PEER39_PASSWORD=secret bash preflight.sh"
    note_fail
  fi
fi

if [ -n "$USERNAME" ] && [ -n "$PASSWORD" ]; then
  if ! command -v curl >/dev/null 2>&1; then
    fail "curl not found — cannot test Peer39 login"
    hint "Install curl, then re-run."
    note_fail
  else
    BODY_FILE="$(mktemp)"
    HTTP_CODE="$(curl -sS -o "$BODY_FILE" -w '%{http_code}' \
      -X POST https://app.peer39.com/api/external/login \
      -H 'Content-Type: application/json' \
      --data-binary "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" 2>/dev/null || echo "000")"
    case "$HTTP_CODE" in
      200)
        if grep -q 'sessionId' "$BODY_FILE"; then
          ok "Peer39 login succeeded (got a sessionId)"
        else
          fail "Peer39 returned 200 but no sessionId — unexpected response"
          hint "Response body: $(cat "$BODY_FILE")"
          note_fail
        fi
        ;;
      401)
        fail "Peer39 login failed (401)"
        hint "Either the credentials are wrong, OR the account is missing the"
        hint "'External API' / 'RTB Buyer' roles. Ask your Peer39 integration"
        hint "manager to verify and add the roles."
        note_fail
        ;;
      000)
        fail "Could not reach app.peer39.com"
        hint "Check your network. Are you connected to the corporate VPN if required?"
        note_fail
        ;;
      *)
        fail "Peer39 login returned HTTP $HTTP_CODE"
        hint "Response body: $(cat "$BODY_FILE")"
        note_fail
        ;;
    esac
    rm -f "$BODY_FILE"
  fi
fi

###############################################################################
# 6. Account-specific values (buyer ID, system name, default email)
###############################################################################
step "6. Account-specific values"
echo "      These are bound to your Peer39 account, not your login. Find buyer ID and"
echo "      system name on your account page at https://app.peer39.com/accounts."
echo

BUYER_ID="${PEER39_BUYER_ID:-}"
SYSTEM_NAME="${PEER39_SYSTEM:-}"
USER_EMAIL="${PEER39_USER_EMAIL:-}"

# If the Peer39 username is itself an email address, reuse it as the user's
# email so the tester doesn't have to type it twice.
EMAIL_REGEX='^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
if [ -z "$USER_EMAIL" ] && printf '%s' "$USERNAME" | grep -Eq "$EMAIL_REGEX"; then
  USER_EMAIL="$USERNAME"
  echo "      Using your username as your email: $USER_EMAIL"
fi

if [ -t 0 ]; then
  if [ -z "$BUYER_ID" ]; then
    printf "      Buyer ID (numeric): "
    read -r BUYER_ID
  fi
  if [ -z "$SYSTEM_NAME" ]; then
    printf "      System name: "
    read -r SYSTEM_NAME
  fi
  if [ -z "$USER_EMAIL" ]; then
    printf "      Your email address: "
    read -r USER_EMAIL
  fi
fi

# Light client-side validation; the API will reject anything still wrong.
if ! printf '%s' "$BUYER_ID" | grep -Eq '^[0-9]+$'; then
  fail "Buyer ID must be a positive integer; got '$BUYER_ID'"
  hint "Look on https://app.peer39.com/accounts for the numeric account id."
  note_fail
  BUYER_ID=""
else
  ok "Buyer ID: $BUYER_ID"
fi
if [ -z "$SYSTEM_NAME" ]; then
  fail "System name is empty"
  hint "The 'system' header is auto-generated and visible on https://app.peer39.com/accounts."
  note_fail
else
  ok "System name: $SYSTEM_NAME"
fi
if ! printf '%s' "$USER_EMAIL" | grep -Eq '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'; then
  fail "Email is not a valid address: '$USER_EMAIL'"
  note_fail
  USER_EMAIL=""
else
  ok "Your email: $USER_EMAIL"
fi

###############################################################################
# Summary
###############################################################################
printf "\n${BOLD}Summary${RESET}\n"
if [ "$FAIL_COUNT" -eq 0 ]; then
  ok "All checks passed."
  echo
  echo "Claude Desktop config location:"
  echo "  $CLAUDE_CONFIG"
  echo

  DO_INSTALL=""
  if [ -t 0 ]; then
    printf "Add the peer39 entry to your Claude Desktop config automatically? [Y/n] "
    read -r DO_INSTALL
    DO_INSTALL="${DO_INSTALL:-Y}"
  else
    echo "(non-interactive shell — skipping auto-install. Re-run interactively to enable.)"
    DO_INSTALL="N"
  fi

  case "$DO_INSTALL" in
    n|N|no|NO|No)
      cat <<EOF

Manual install — paste this entry under "mcpServers" in the config file above:

  "peer39": {
    "command": "npx",
    "args": ["-y", "github:awhite07/p39-custom-category-mcp#v1.0.8"],
    "env": {
      "PEER39_USERNAME": "$USERNAME",
      "PEER39_PASSWORD": "<your password>"
    }
  }

Then quit Claude Desktop (⌘Q on macOS) and reopen it.
EOF
      ;;
    *)
      if [ -z "$CLAUDE_DIR" ]; then
        fail "Don't know where Claude Desktop config lives on this OS — skipping auto-install."
        exit 1
      fi
      mkdir -p "$CLAUDE_DIR"
      if [ -f "$CLAUDE_CONFIG" ]; then
        BACKUP="${CLAUDE_CONFIG}.bak.$(date +%Y%m%d-%H%M%S)"
        cp "$CLAUDE_CONFIG" "$BACKUP"
        ok "Backed up existing config to: $BACKUP"
      fi
      # Merge via Node (already verified present in step 3). Writes all values
      # — login secrets AND account-specific values — into the same env block
      # so the user has one source of truth.
      PEER39_USERNAME_FOR_NODE="$USERNAME" \
      PEER39_PASSWORD_FOR_NODE="$PASSWORD" \
      PEER39_BUYER_ID_FOR_NODE="$BUYER_ID" \
      PEER39_SYSTEM_FOR_NODE="$SYSTEM_NAME" \
      PEER39_USER_EMAIL_FOR_NODE="$USER_EMAIL" \
      CLAUDE_CONFIG_PATH="$CLAUDE_CONFIG" \
      node -e '
        const fs = require("fs");
        const p = process.env.CLAUDE_CONFIG_PATH;
        let cfg = {};
        if (fs.existsSync(p)) {
          try { cfg = JSON.parse(fs.readFileSync(p, "utf8")); }
          catch (e) {
            console.error("Existing config file is not valid JSON — refusing to overwrite. Fix it manually and re-run.");
            console.error(e.message);
            process.exit(2);
          }
        }
        if (typeof cfg !== "object" || cfg === null || Array.isArray(cfg)) {
          console.error("Existing config root is not a JSON object — refusing to overwrite.");
          process.exit(2);
        }
        cfg.mcpServers = cfg.mcpServers || {};
        const env = {
          PEER39_USERNAME: process.env.PEER39_USERNAME_FOR_NODE,
          PEER39_PASSWORD: process.env.PEER39_PASSWORD_FOR_NODE,
        };
        if (process.env.PEER39_BUYER_ID_FOR_NODE) env.PEER39_BUYER_ID = process.env.PEER39_BUYER_ID_FOR_NODE;
        if (process.env.PEER39_SYSTEM_FOR_NODE) env.PEER39_SYSTEM = process.env.PEER39_SYSTEM_FOR_NODE;
        if (process.env.PEER39_USER_EMAIL_FOR_NODE) env.PEER39_USER_EMAIL = process.env.PEER39_USER_EMAIL_FOR_NODE;
        cfg.mcpServers.peer39 = {
          command: "npx",
          args: ["-y", "github:awhite07/p39-custom-category-mcp#v1.0.8"],
          env,
        };
        const tmp = p + ".tmp";
        fs.writeFileSync(tmp, JSON.stringify(cfg, null, 2) + "\n", { mode: 0o600 });
        fs.renameSync(tmp, p);
        console.log("Wrote peer39 entry to " + p);
      '
      INSTALL_STATUS=$?
      if [ $INSTALL_STATUS -ne 0 ]; then
        fail "Auto-install failed (exit $INSTALL_STATUS). See the message above. The manual snippet is shown below."
        cat <<EOF

  "peer39": {
    "command": "npx",
    "args": ["-y", "github:awhite07/p39-custom-category-mcp#v1.0.8"],
    "env": {
      "PEER39_USERNAME": "$USERNAME",
      "PEER39_PASSWORD": "<your password>"
    }
  }
EOF
        exit 1
      fi
      ok "peer39 entry installed (login + buyer ID + system + email all in the env block)."
      echo
      echo "Final step:"
      echo "  • Quit Claude Desktop completely (⌘Q on macOS) and reopen it."
      echo "  • In Settings → Developer → Local MCP servers, verify 'peer39'"
      echo "    shows 'Connected' with 10 tools available. First launch"
      echo "    takes ~30–60s while npx clones and builds from GitHub."
      ;;
  esac
  echo
  echo "Then open a new chat and say: \"Use peer39 to check what's set up.\""
  exit 0
else
  fail "$FAIL_COUNT check(s) failed. Address the items above and re-run this script."
  exit 1
fi
