# @peer39/mcp-server

MCP (Model Context Protocol) server for managing **Peer39 Custom Categories** — contextual targeting and brand-safety lists (keywords, URLs, mobile apps, CTV apps) that Peer39 syncs to your connected DSPs (Microsoft Advertising / Xandr, MediaMath, The Trade Desk, Basis, Yahoo, etc.).

Plug it into Claude Desktop (or any MCP-compatible AI agent) and create, read, update, delete, and list your Custom Categories in plain English — no API code required.

## Install

The server runs over stdio. Claude Desktop launches it via `npx`, which can install directly from this GitHub repo — no separate clone or build step on your end.

> **Note:** while this project is pre-release, the install URL points at the GitHub repo (`github:awhite07/p39-custom-category-mcp`). Once we publish to npm under `@peer39`, the URL will change to the package name and everything else stays the same.

### Step 0 — Run the integration script (recommended)

A single script handles the whole integration: it verifies your OS, that Claude Desktop is installed, that you have Node 18+, that your Peer39 credentials work, and then writes the right configuration files for you. If anything's missing, it tells you exactly how to fix it.

**1. Open a terminal**

- **macOS** — press `⌘ + Space` to open Spotlight, type `Terminal`, press Return. A black/white window with a prompt opens.
- **Windows** — open **Git Bash** (install from https://git-scm.com if you don't have it), or **Ubuntu / WSL** from the Start menu.
- **Linux** — open your usual terminal (GNOME Terminal, Konsole, iTerm, etc.).

**2. Paste these two lines into the terminal and press Return**

```bash
curl -fsSL https://raw.githubusercontent.com/awhite07/p39-custom-category-mcp/v1.0.7/scripts/preflight.sh -o /tmp/peer39-integration.sh
bash /tmp/peer39-integration.sh
```

> The URL pins to a specific release tag (`v1.0.7`) rather than `main` so you always get a known-good script — the GitHub CDN can lag behind `main` by several minutes after a push.

The script will prompt for:

- Your Peer39 **username** and **password** — the password won't echo as you type (normal). It calls the real Peer39 login API to confirm them.
- Your **buyer ID** (numeric) and **system name** — find both at https://app.peer39.com/accounts.
- **Your email address** — attached to each category you create as the "last updated by" field. If your Peer39 username is already an email, the script reuses it and skips this prompt.

If you don't want to type all that, pre-set the values as env vars before running: `PEER39_USERNAME=…`, `PEER39_PASSWORD=…`, `PEER39_BUYER_ID=…`, `PEER39_SYSTEM=…`, `PEER39_USER_EMAIL=…`.

**3. Read the output**

Each check prints `✓` (pass) or `✗` (fail) with an explanation underneath. If something is red, follow the `→` hints (where to download Node, who to ask about your Peer39 role, etc.) and re-run the script until it's all green.

**4. Let it install for you**

When all checks pass, the script asks: _"Add the peer39 entry to your Claude Desktop config automatically? [Y/n]"_. Press Return (or type `Y`) and it merges a single `peer39` entry into your `claude_desktop_config.json` containing **all five values** (username, password, buyer ID, system, your email) under the `env` block. Existing entries are preserved; your previous config is backed up with a timestamped `.bak.<timestamp>` suffix. One file, one source of truth.

After that, **fully quit Claude Desktop (`⌘Q` on macOS) and reopen it**. The MCP entry is read at startup; a window-close doesn't pick up the change.

If you'd rather edit the config yourself, type `n` at the prompt and the script will print the JSON snippet to paste manually — same as before.

## Claude Desktop config

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent on your OS:

```json
{
  "mcpServers": {
    "peer39": {
      "command": "npx",
      "args": ["-y", "github:awhite07/p39-custom-category-mcp#v1.0.7"],
      "env": {
        "PEER39_USERNAME": "your.api.user",
        "PEER39_PASSWORD": "your-api-password",
        "PEER39_BUYER_ID": "1234567",
        "PEER39_SYSTEM": "your-system-name",
        "PEER39_USER_EMAIL": "you@example.com"
      }
    }
  }
}
```

Only `PEER39_USERNAME` and `PEER39_PASSWORD` are strictly required at startup. The other three keep `peer39_create_category` from prompting you for them in every chat — without them, the MCP will return a friendly "set this with `peer39_configure`" error on the first call.

Restart Claude Desktop. You should see **peer39 — 10 tools available — Connected** in Settings → Developer.

The first launch will take 30–60s while `npx` clones the repo and runs the TypeScript build. Subsequent launches are fast (npx caches).

## Configuration

Only `PEER39_USERNAME` and `PEER39_PASSWORD` are required. Everything else is optional and can be set three ways (priority: tool arg → runtime config file → env var):

| Env var | Purpose | Required? |
|---|---|---|
| `PEER39_USERNAME` | Your Peer39 API login. Must have the **External API** and **RTB Buyer** roles. | **Yes** |
| `PEER39_PASSWORD` | Password for that login. | **Yes** |
| `PEER39_BUYER_ID` | Your numeric buyer account id. Find at https://app.peer39.com/accounts | No |
| `PEER39_SYSTEM` | Auto-generated "system name" for your account. Required only for create-category calls. | No |
| `PEER39_USER_EMAIL` | Your email address — attached to categories you create as "last updated by". | No |
| `PEER39_DEFAULT_PARTNER_ID` | Numeric DSP partner id (e.g. `841` for Xandr / Microsoft Advertising). | No |
| `PEER39_BASE_URL` | Override the API base URL. Defaults to `https://app.peer39.com`. | No |

You can also save the optional values **from Claude**, in conversation:

> _"Save my buyer ID 12345 and use The Trade Desk as the default DSP."_

That triggers the `peer39_configure` tool, which writes `~/.peer39-mcp/config.json` (0o600). The values persist across restarts.

If a value isn't set anywhere when a tool needs it, the tool returns a friendly error telling Claude what's missing, where to find it, and how to save it.

## Tools

| Tool | What it does |
|---|---|
| `peer39_configure` | Persist buyer ID, system, default email, default partner to `~/.peer39-mcp/config.json`. |
| `peer39_check_setup` | Report current configuration: what's set, what's missing, where to find each missing value. |
| `peer39_create_category` | Create a new custom category (keyword / URL / mobile app / CTV app / mobile-keyword / CTV-keyword) and sync to a DSP. |
| `peer39_get_category` | Fetch one category's full details. |
| `peer39_list_categories` | List categories on a buyer account, with filtering and paging. |
| `peer39_update_category_details` | Update only the metadata (name, type, description, language, expiration, email). |
| `peer39_update_category_items` | Modify the items list. **Defaults to append**; pass `append: false` to replace. |
| `peer39_update_category` | "Update all" — rewrite name + items + everything in one call. |
| `peer39_delete_category` | Batch delete categories. Destructive — confirm with the user first. |
| `peer39_get_url_examples` | Preview which URLs Peer39 would classify as matching a set of keyword phrases. **Only meaningful for web keyword categories (type 2)** — not for URL, mobile-app, CTV-app, mobile-app-keyword, or CTV-keyword categories. |

## DSP partner names

`peer39_create_category` and other tools that take a `partnerId` accept either a numeric ID or a friendly name (case-insensitive). Known names:

`mediamath` · `microsoft-advertising` / `xandr` · `nexxen` · `perion` · `illumin` · `zeta` / `zeta-dsp` · `the-trade-desk` / `ttd` · `basis` / `basis-technologies` · `yahoo` / `verizon-media` · `adobe` · `adform` · `sky` · `viant` · `bidtellect` · `deepintent` · `index-exchange` · `adtheorent` · `sportradar` · `reticle` · `equativ` · `blis` · `amazon` · `amazon-publisher-services` / `aps` · `genius-sports` · `freewheel` · `the-philadelphia-inquirer` · `the-media-trust` · `adobe-dsp`

Pass a numeric ID for anything not on this list. Find IDs at https://app.peer39.com/partners or ask your Peer39 integration manager.

## Important behavior notes

- **`peer39_update_category_items` defaults to append.** The underlying Peer39 API defaults to *replace*, which is destructive. This MCP inverts the default so accidental replacement isn't possible. Always pass `append: false` explicitly to replace.
- **`peer39_get_url_examples` uses lowercase `"all"` as the language wildcard.** Every other endpoint uses `"All"` (capitalized). Both are validated client-side.
- **HTTP method for delete is PUT, not DELETE.** Wrapped by the tool — you won't notice unless you're reading network logs.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `401 Peer39 login failed` | Wrong username/password, or account is missing the **External API** role. Ask your Peer39 integration manager to add it. |
| `[code 63] Invalid system parameter` | `PEER39_SYSTEM` is unset or wrong. Find the value on your account page in https://app.peer39.com. |
| `[code 6] Account ID not found` or `[code 31] Invalid Account ID` | The category's `accountCategoryId` doesn't belong to this buyer + partner combo. |
| `[code 51] Invalid Buyer ID` | The configured buyer ID doesn't match your account. Re-check at https://app.peer39.com/accounts. |
| `[code 47] Invalid type` | The category type isn't supported for this operation. Types: 2 keyword, 3 URL, 5 mobile app, 6 CTV app, 7 mobile-app keyword, 8 CTV keyword. |
| `Unknown partner name "X"` | Name isn't in the built-in map. Pass the numeric ID instead. |
| `Missing configuration: …` | Run `peer39_check_setup` to see what's missing, then `peer39_configure` to save it. |

## Development

```bash
npm install
npm run typecheck    # tsc --noEmit
npm test             # vitest unit tests (uses MSW for HTTP mocking)
npm run build        # emits dist/

# live smoke against a real Peer39 account — requires .env with real creds
cp .env.example .env
# fill in PEER39_USERNAME, PEER39_PASSWORD, PEER39_BUYER_ID, PEER39_SYSTEM, PEER39_DEFAULT_PARTNER_ID
RUN_LIVE_TESTS=true npm run smoke
```

The smoke test creates a disposable category named `mcp-smoke-${timestamp}` and deletes it in `afterAll`.

## Releasing a new version (maintainer note)

User-facing URLs in this README and in `scripts/preflight.sh` pin to a specific git tag (e.g. `v1.0.0`). To ship a change:

1. Edit code / docs as needed. If the change is user-facing, bump the next version everywhere it's pinned:
   - `package.json` `version` field
   - `src/index.ts` server name+version constant
   - `README.md` (replace old tag with new tag throughout — `:%s/v1.0.0/v1.0.0/g`)
   - `scripts/preflight.sh` (the embedded `github:...#v1.0.0` ref inside the auto-install block)
2. Commit the version bumps and push to `main`.
3. Tag and push: `git tag v1.0.0 && git push origin v1.0.0`.

Testers running the curl URL or `npx -y github:awhite07/p39-custom-category-mcp#v1.0.7` will resolve to the new commit immediately — no CDN cache lag because each tag is an immutable ref.

Never re-point an existing tag (`git push --force` on a tag) — that breaks caches in unpredictable ways for anyone who already installed.

## License

UNLICENSED — internal Peer39 project.
