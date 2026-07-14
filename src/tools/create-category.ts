import { CreateCategoryInputSchema } from '../validation/schemas.js';
import { createCategory } from '../api/categories.js';
import { resolvePartnerId, partnerIdToName } from '../partners.js';
import { resolve } from '../resolve.js';
import type { CategoryResponse, CategoryType, ItemsType } from '../api/types.js';
import type { ToolDefinition } from './index.js';
import { errorResult, formatToolError, textResult } from './index.js';

const CATEGORY_TYPE_NAMES: Record<CategoryType, string> = {
  2: 'Keyword',
  3: 'URL',
  5: 'Mobile App',
  6: 'CTV App',
  7: 'Mobile App Keywords',
  8: 'CTV Keywords',
};

export function formatCreatedSummary(opts: {
  res: CategoryResponse;
  categoryName: string;
  type: CategoryType;
  items: string[];
  itemsTypes?: ItemsType[];
  partnerId: number;
  buyerId: number;
  expirationDate?: string;
}): string {
  const v = opts.res.value ?? {};
  const typeName = CATEGORY_TYPE_NAMES[opts.type] ?? `type ${opts.type}`;
  const partnerSlug = partnerIdToName(opts.partnerId);
  const partnerLabel = partnerSlug ? `${partnerSlug} (id ${opts.partnerId})` : `partner id ${opts.partnerId}`;
  const partnerDisplay = partnerSlug ? prettifyPartnerName(partnerSlug) : `partner id ${opts.partnerId}`;
  const buyerLabel = v.buyerName ? `${v.buyerName} (buyer id ${opts.buyerId})` : `buyer id ${opts.buyerId}`;
  const categoryName = (typeof v.categoryName === 'string' && v.categoryName) ? v.categoryName : opts.categoryName;
  const partnerCategoryId = (v.partner as { partnerCategoryId?: number | string } | undefined)?.partnerCategoryId;
  const accountCategoryId = v.accountCategoryId;

  let itemsLine = `- Items: ${opts.items.length}`;
  if (opts.itemsTypes && opts.itemsTypes.length > 0) {
    const counts = opts.itemsTypes.reduce<Record<string, number>>((acc, t) => {
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {});
    const breakdown = Object.entries(counts).map(([k, n]) => `${n} ${k.toLowerCase()}`).join(', ');
    itemsLine += ` (${breakdown})`;
  }

  const lines: string[] = [
    'Category created.',
    '',
    `**${categoryName}**`,
    `- Type: ${typeName}`,
    itemsLine,
    `- DSP: ${partnerLabel}`,
    `- Buyer account: ${buyerLabel}`,
  ];
  if (opts.expirationDate) lines.push(`- Expires: ${opts.expirationDate}`);
  if (partnerCategoryId !== undefined) lines.push(`- Partner category ID: ${partnerCategoryId}`);
  if (accountCategoryId !== undefined) lines.push(`- Account category ID: ${accountCategoryId}`);
  lines.push('');
  lines.push(`The category is now live on ${partnerDisplay}.`);
  return lines.join('\n');
}

function prettifyPartnerName(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

export const createCategoryTool: ToolDefinition = {
  name: 'peer39_create_category',
  description: `Create a new Peer39 custom category and sync it to a connected DSP.

## When to use
The user wants to define a new contextual targeting or brand-safety list of keywords (or, for web campaigns, URLs) and have it activated in their DSP seat (Yahoo DSP, The Trade Desk, Microsoft Advertising / Xandr, MediaMath, Basis, etc.). When the user says they want to create a category, start this conversation flow immediately — do NOT run peer39_check_setup or any other tool first.

## Conversation flow — lead the user through these steps IN THIS ORDER, one step per message. Do NOT ask everything at once.

Keep the whole conversation about their campaign — never mention API plumbing (setup checks, buyer IDs, accounts, credentials, config).

The COMPLETE question list for this flow is: (1) audience + channel, (2) partner, (3) items, (4) name confirmation — and (1) and (2) are skipped when already known. Every question must map directly to a tool input (type, partnerId, items, categoryName). Never invent other questions — no "what's your primary goal", no use-case / objective / KPI / budget / flight-date / brand-safety-vs-targeting questions. Nothing else is configurable.

1. **Audience & channel** (this determines **type**) — if the user hasn't already said, ask in ONE question:
       _"Who are you trying to reach, and what channel is the campaign running on — web/display, mobile app, or CTV?"_
   The audience half is only context for brainstorming keywords in step 3 — do not probe further into goals or strategy. Derive the category type yourself from the channel. Custom categories are keyword-based; the channel alone determines the type. Do NOT ask the user to pick a type, show them type numbers, or offer any item-kind menu:
   - Web/display → 2 (Keyword) — or 3 (URL) only if they say they want to target specific sites/pages
   - Mobile in-app → 7 (Mobile App Keywords)
   - CTV → 8 (CTV Keywords)
   A category holds exactly ONE kind of item — never offer "a mix". For mobile and CTV there is nothing to disambiguate: once you know the channel, go straight to step 2 — the category will be keywords. Do NOT offer app-ID / app-list categories (types 5 and 6 exist in the API but use them only if the user explicitly insists on targeting a list of specific apps). Never offer URLs outside web/display.
   Web/display is the only channel with a choice (keywords vs specific URLs): default to keywords and confirm in passing ("I'll build this as a keyword category — say the word if you'd rather target specific sites").
2. **partnerId** — which partner should this category sync to?
   - If the user already named a partner anywhere in the conversation (e.g. "a new category on Yahoo"), use it — do NOT ask again and do NOT re-confirm it.
   - Only if no partner has been mentioned, ask:
       _"Which partner is this category for? (e.g. Yahoo DSP, The Trade Desk, Microsoft Advertising / Xandr, MediaMath, Basis)"_
   - NEVER present "Peer39" as an option here — every custom category is built in Peer39 by definition; the only question is which partner it syncs to. Do not phrase this as "which platform".
   - Do not fall back to a saved default without the user naming a partner.
   - Accept either a slug like "yahoo" / "the-trade-desk" / "xandr" / "basis" or a numeric partner ID.
3. **items** — the actual keywords (or URLs for a web URL category). Non-empty array; each ≤1024 chars.
   - Offer BOTH paths in your prompt. Use this phrasing pattern:
       _"Now, what <items> do you want in the category? Share them as a list and I'll set them up — **or** we can discuss the types of content that would fit best and brainstorm them together."_
     where <items> is "keywords" or "URLs" depending on type.
   - If the user wants to brainstorm, propose 8–20 candidates based on their goal, present them as a numbered list, and let them edit (add / remove / refine) before locking in.
   - For keyword categories (type=2 only), you may also ask whether they want any items marked MUST_HAVE or EXCLUDE for boolean logic — but only if the user brings up that nuance. Default is REGULAR for all items.
4. **categoryName** — always the LAST step; never bring up the name before the items are locked in. After they've given you the items, suggest a short name based on those items (≤120 chars, alphanumeric + space + "-" "&" "_" only) and confirm. Don't make them type a name from scratch unless they want to.

## Auto-filled — do NOT mention these to the user, do NOT offer them as "anything else you want to set"

- **expirationDate** — defaults to 6 months from today.
- **languageCodes** — defaults to ["All"] (Peer39 wildcard for "any language").
- **safeFrom** — defaults to false. Only meaningful for keyword categories. Don't mention it unless the user asks about safe-from / brand-safety inversion.
- **emailAddress** — handled silently by the server; do NOT mention or ask about email.
- **buyerId** — handled silently by the server; do NOT mention or ask about it.
- **system** — handled silently by the server; do NOT mention or ask about it.
- **description** — leave unset. Do NOT ask the user for a category description. The category name is the only label they need.
- **advertiserId, buyerName** — leave unset.

After step 4 (name confirmed) you have everything. Call this tool. Do NOT do a "before I create, is there anything else you want to set?" pass — that surfaces fields the user shouldn't have to think about.

## Types reference
2 = Keyword, 3 = URL, 5 = Mobile App, 6 = CTV App, 7 = Mobile App Keywords, 8 = CTV Keywords`,
  inputSchema: CreateCategoryInputSchema,
  async handler(rawArgs) {
    const parsed = CreateCategoryInputSchema.safeParse(rawArgs);
    if (!parsed.success) return errorResult(`Validation failed: ${parsed.error.message}`);
    const args = parsed.data;
    try {
      const buyerId = await resolve('buyerId', args.buyerId);
      const system = await resolve('system');
      const emailAddress = await resolve('userEmail', args.emailAddress);
      const partnerId = resolvePartnerId(args.partnerId);

      const res = await createCategory({
        value: {
          buyerId,
          buyerName: args.buyerName,
          partner: {
            id: partnerId,
            ...(args.advertiserId ? { dspData: { advertiserId: args.advertiserId } } : {}),
          },
          categoryName: args.categoryName,
          safeFrom: args.safeFrom,
          emailAddress,
          expirationDate: args.expirationDate,
          items: args.items,
          ...(args.itemsTypes ? { itemsTypes: args.itemsTypes } : {}),
          type: args.type,
          ...(args.description !== undefined ? { description: args.description } : {}),
          languageCodes: args.languageCodes,
        },
      }, { system });
      return textResult(formatCreatedSummary({
        res,
        categoryName: args.categoryName,
        type: args.type,
        items: args.items,
        itemsTypes: args.itemsTypes,
        partnerId,
        buyerId,
        expirationDate: args.expirationDate,
      }));
    } catch (err) {
      return formatToolError(err);
    }
  },
};
