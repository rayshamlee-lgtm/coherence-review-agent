// Prompts for L2 (application-quality design judgment) and L3 (cross-segment
// coherence warnings). Both target Azure OpenAI vision-capable deployments.
// Output is strict JSON for predictable rendering.

// ─────────────────────────────────────────────────────────────────────────
// Design Quality Guide (ACF) toggle.
// When true, injects additions sourced from the Microsoft ACF Quality Guide
// (operating principles + the Imagery dimension). When false, the prompt
// reverts to the original 5-dimension rubric. Used for A/B comparing review
// output with vs without the guide-derived criteria.
const DESIGN_QUALITY_GUIDE_ENABLED = false;
// ─────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
// Placeholder-content toggle.
// When true, tells L2/L3 that the text / numbers / names / thumbnails are
// PLACEHOLDER data, so the model stops raising content-consistency issues
// that only make sense against real copy (mismatched title/description,
// duplicated card titles, badge counts that don't match item counts, "this
// headline is weak", etc.). Structural text checks (truncation, missing copy
// slots, empty/error states) are kept. Flip to false when reviewing a design
// that ships with final, real content.
const PLACEHOLDER_CONTENT_MODE = true;
// ─────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_CONTENT_CLAUSE = `
PLACEHOLDER CONTENT — the text, numbers, names, and thumbnails in this design
are PLACEHOLDER / dummy data, not the real shipped content. The designer is
iterating on layout and the design system, not on the literal copy. Therefore:
  • Do NOT raise content-consistency issues that depend on the literal
    strings being real — e.g. "the title says X but the description says Y",
    "the same entity is named differently in two places", "the badge count (5)
    doesn't match the 3 items shown", "every card repeats the same title", or
    "this copy is factually wrong / off-topic for the query".
  • Do NOT critique the wording quality of individual placeholder strings
    ("this headline is weak / redundant / could be punchier") — the real copy
    will differ.
  • DO still evaluate text STRUCTURE & BEHAVIOR, which holds regardless of the
    final words: truncation / overflow that loses information, a missing copy
    slot where the pattern clearly needs one, empty / error / loading states
    with no actionable affordance, and legibility driven by layout.
Treat repeated, mismatched, or lorem-style placeholder text as a data
artifact, NOT a design defect.`;

// — From ACF Design Quality Guide —
const DQG_PRINCIPLES = `
Operating principles — apply these as tie-breakers whenever an issue is borderline:
  • Clarity > beauty. If primary-vs-secondary information is unclear or the
    reading path is jumbled, the design does not pass — regardless of how
    polished it looks.
  • Restraint > expressiveness. Emphasis is allowed, but decorative or
    expressive elements must not pull attention from the primary content.
  • Observable evidence only. Every issue must point to something visible
    in the screenshot or tree. Do NOT use phrases like "feels off",
    "I think", "could be better" — name the specific element and the
    concrete visual cue that triggered the call. If you cannot point at
    pixels or a node, do not raise the issue.
`;

// — From ACF Design Quality Guide —
const DQG_IMAGERY_DIMENSION = `
  • Imagery — "is each image the right image?"
      Judge every image / illustration / thumbnail on three lenses:
        — Entity match: does the image depict the actual entity named in
          the title, or a coincidentally-named different thing? Flag
          referent drift (e.g. "Visit Rainier" card paired with a can of
          Rainier beer instead of the mountain).
        — Mood / emotional register: does the image's tone (cheerful /
          contemplative / dramatic / clinical) match the query's
          emotional weight? Flag cheerful/cartoonish art on somber
          queries (e.g. a date-of-death card with a smiling publicity
          still), sensationalized art on neutral news, or overly cold
          stock imagery where warmth is expected.
        — Brand register: even when semantically correct, does the image
          carry the right emotional register for the entity? (E.g. a
          server-rack photo for Microsoft is on-topic but cold; a
          colorful office-life photo better fits the brand voice.)
      ⚠️ Do NOT comment on resolution / pixelation / aspect ratio — those
         are mechanical and belong elsewhere. Judge only the SEMANTIC
         and EMOTIONAL fit of the image choice.
      ⚠️ If there are no images in the design, emit a "not_applicable"
         verdict — do not invent an issue.
`;

const DIM_COUNT_WORD = DESIGN_QUALITY_GUIDE_ENABLED ? "six" : "five";
const DIM_ENUM_FRAGMENT = DESIGN_QUALITY_GUIDE_ENABLED
  ? `"intent" | "hierarchy" | "content" | "usability" | "scalability" | "imagery"`
  : `"intent" | "hierarchy" | "content" | "usability" | "scalability"`;
const COVERAGE_IMAGERY_LINE = DESIGN_QUALITY_GUIDE_ENABLED
  ? `,\n    "imagery":     { "verdict": "ok | issues_found | not_applicable", "note": "...", "issueIds": [] }`
  : ``;

const COMMON_FRAMING = `You are a senior design reviewer on the Bing Search Design Council.
You evaluate designs against the Bing Design System (ACF / SMTC tokens, Stone /
Stone-blue / Bing Classic themes) and the Search-team Coherence Review rubric.
Be concrete, terse, and reference the visible element by name when possible.
Always reply as strict JSON matching the requested schema.
${DESIGN_QUALITY_GUIDE_ENABLED ? DQG_PRINCIPLES : ""}
OUT OF SCOPE — do NOT raise any issue against the following parts of the
screenshot, even if you can see them. They are standard page chrome or
placeholder content that the design owner has not authored:
  • The site header (Bing logo, search box, sign-in, profile, vertical-page
    tabs such as All / Images / Videos / Maps / News / Shopping / More).
  • The algo (algorithmic) search results below the designed module —
    standard Wikipedia / link / news cards used as visual filler.
  • The "Related searches" rail.
  • The page footer.
Treat the design under review as the module(s) between the header and the
algo results. The Figma tree summary already excludes these regions.
${PLACEHOLDER_CONTENT_MODE ? PLACEHOLDER_CONTENT_CLAUSE : ""}`;

function scopeBlock(reviewScope) {
  if (!reviewScope || !reviewScope.trim()) return "";
  return `⚠️ REVIEW SCOPE — read this first and honor it strictly.

The design owner has specified what to review. Only evaluate the parts
they call out as in-scope. If the frame includes surrounding content
(related searches, ads, navigation chrome, other SERP modules, etc.)
that is NOT part of the design under review, IGNORE it — do not raise
issues against it, do not let it affect dimension verdicts, do not
include it in cross-team flags. If you are unsure whether an element is
in scope, err on the side of excluding it and note the ambiguity.

Owner's scope statement:
---
${reviewScope.trim()}
---

`;
}

function contextBlock(projectContext) {
  if (!projectContext || !projectContext.trim()) return "";
  return `Project context provided by the design owner (use this to interpret
intent and constraints — but do NOT treat it as a defense of weak design;
your job is still to flag issues even if the owner's note suggests they
are intentional):

---
${projectContext.trim()}
---

`;
}

// Render a structural-scope block when the reviewer drew a sub-rectangle
// on the preview. It pairs naturally with the existing `reviewScope` text
// (free-form intent) — both can be present and reinforce each other.
function structuralScopeBlock(scopeBlurb) {
  if (!scopeBlurb) return "";
  return `${scopeBlurb}\n\n`;
}

export function l2Messages({ imageUrl, treeSummary, l1Summary, projectContext, reviewScope, scopeBlurb }) {
  const system = `${COMMON_FRAMING}

You are running LEVEL 2 — Application Quality. Don't relitigate Level 1
(token compliance) — assume the L1 findings are handled separately.

WORK IN THREE PASSES — do not skip any:

  Pass 1 (Observe). Look at the design freely and list every concrete
    issue you notice. Do NOT think about dimensions yet. Just describe
    what is wrong / weak / surprising, where it is, why it matters.
    If the design is genuinely strong, return an empty issues array —
    do NOT invent problems to fill quota.

    Then severity-tag EVERY observation against the ladder below.

    SEVERITY LADDER — apply per-issue, regardless of dimension:
      • P0 (severity: "error") — Ship blocker. Without this fix, a
        meaningful portion of users will misunderstand, fail to use, or
        be misled by the design. Examples across dimensions: primary
        action genuinely undiscoverable; image semantically wrong for
        the entity (Rainier mountain vs. Rainier beer); RTL layout
        completely broken; contrast unreadable; primary information
        buried below filler.
      • P1 (severity: "warn") — Quality miss. Not catastrophic, but
        any competent designer would agree it lowers the experience and
        should be fixed before next stage. Examples: hierarchy is
        weaker than it should be (you can still figure it out); image
        is on-topic but emotionally off; density a bit cramped in one
        region; truncation cuts useful (not critical) info.
      • P2 (severity: "info") — Polish / nit / personal preference.
        Examples: "spacing could be slightly more generous"; "I'd
        consider a different icon family"; "the title could be
        snappier"; "this feels a touch empty". If your justification
        starts with "could be", "feels", "I'd prefer", "slightly", or
        "a bit more" — it is P2. Emit it so the designer can see it,
        but it will NOT count toward the score.

    P2 items are displayed but not scored, so include them only when
    they're genuinely actionable polish notes — not filler. If you
    cannot point at the specific element, drop the observation entirely.

  Pass 2 (Categorize). For each issue from Pass 1, tag it with one or
    more of the ${DIM_COUNT_WORD} dimensions below (\`dimensions\` field). Dimensions
    are LABELS here, not analysis prompts.

  Pass 3 (Coverage check). For every one of the ${DIM_COUNT_WORD} dimensions, emit
    a one-line verdict — "ok", "issues_found", or "not_applicable" —
    so the reviewer knows you actually considered it. Only
    "issues_found" needs to reference issue ids; "ok" and
    "not_applicable" need at most a short note.

The ${DIM_COUNT_WORD} dimensions (each has a STRICT scope — never tag one issue
under two overlapping dimensions; pick the most specific):

  • Intent Alignment — "should this exist / is it serving the job?"
      Look at: presence/absence of elements relative to the user's
      core intent, irrelevant/distracting elements, primary-vs-secondary
      intent tradeoffs.
      ⚠️ Do NOT comment on "is the button obvious / easy to click" —
         that belongs to Usability.

  • Hierarchy — "static structure: what do I see at a glance?"
      Look at: 3-second scan test, visual weight matching information
      priority, Gestalt grouping (proximity / similarity / alignment),
      information density and whitespace balance.
      ⚠️ Do NOT comment on "does the user flow smoothly to the next
         step" — that is the reading-path part of Usability.

  • Content & Microcopy Quality — "is the text itself effective?"
      (Distinct from L1's hard rules like sentence case / glossary.)
      Look at: ${PLACEHOLDER_CONTENT_MODE
        ? `truncation strategy (does the cut-off lose key info?), empty /
      error / loading copy that lacks an actionable next step, and whether a
      needed copy slot is missing. Because the copy is PLACEHOLDER (see the
      placeholder-content rule above), do NOT judge wording quality, filler/
      redundancy, or same-thing-named-differently / front-back consistency of
      the literal strings — judge only the text's structure and behavior.`
        : `scannability of labels/titles, filler/redundant phrasing,
      truncation strategy (does the cut-off lose key info?), empty /
      error / loading copy that lacks an actionable next step,
      same-thing-named-differently inconsistencies.`}
      ⚠️ Do NOT comment on font size / weight / color — that is L1.
         Judge only whether the WORDS are well-written.

  • Usability — "dynamic operation: is it actually usable?"
      First classify the scenario, then evaluate:
        — "look" (browse): reading/scanning flow line, ability to judge
          relevance quickly (summary / label / thumbnail signal strength),
          ease of navigation / pagination / expand-collapse.
        — "use" (act): primary action discoverability, affordance &
          signifiers (does interactive look interactive? do non-
          interactive things mislead?), system feedback after action,
          step count / cognitive load.
      ⚠️ Hierarchy vs Usability(look): Hierarchy is static "what do I
         see"; Usability(look) is dynamic "does my eye flow well as I
         read down."
      ⚠️ Intent vs Usability: Intent asks "should this be designed";
         Usability asks "given it is, does it work."

  • Scalability — "does it hold up under stress?"
      Actively stress-test: very short / very long text, multi-language
      including RTL, missing/tall/wide imagery, empty / loading / error
      / permission-denied states, dark mode, narrow & wide viewports.
${DESIGN_QUALITY_GUIDE_ENABLED ? DQG_IMAGERY_DIMENSION : ""}
For every entry in issues you MUST include a "nodeId" taken verbatim
from the [id=…] tag in the tree summary. Pick the SMALLEST / MOST
SPECIFIC node that the issue is actually about:
  - If it's about a single label, pick that TEXT node's id.
  - If it's about one button, pick that button's id.
  - If it's about a whole card's layout, then pick the card's id.
  - NEVER default to the root frame or an outer wrapper.
Walk down the tree to the deepest node whose bounding box matches what
you're flagging visually. If no node in the tree matches at all, omit
the field entirely (rare).`;

  const schema = `{
  "summary": "1-2 sentence overall L2 read of the design",
  "issues": [
    {
      "id": "i1",                              // stable id; referenced from coverage
      "title": "short label",
      "severity": "error | warn | info",              // error = P0 ship blocker; warn = P1 quality miss; info = P2 polish (shown but not scored).
      "where": "human-readable area (e.g. 'Customer Service card')",
      "nodeId": "the [id=...] from the tree summary — most specific node, NOT the root frame. Omit only if no node matches.",
      "why": "...",
      "dimensions": [${DIM_ENUM_FRAGMENT}, "..."],   // 1+ labels
      "recommendation": "one-sentence direction, not a concrete solution"
    }
  ],
  "coverage": {
    "intent":      { "verdict": "ok | issues_found | not_applicable", "note": "optional short note for ok/n/a", "issueIds": ["i1", "..."] },
    "hierarchy":   { "verdict": "...", "note": "...", "issueIds": [] },
    "content":     { "verdict": "...", "note": "...", "issueIds": [] },
    "usability":   { "verdict": "...", "scenario": "look | use | mixed | n/a", "note": "...", "issueIds": [] },
    "scalability": { "verdict": "...", "note": "...", "issueIds": [] }${COVERAGE_IMAGERY_LINE}
  }
}`;

  return [
    { role: "system", content: system },
    {
      role: "user",
      content: [
        { type: "text", text:
`Here is the rendered design and a structural summary of the Figma tree.

${structuralScopeBlock(scopeBlurb)}${scopeBlock(reviewScope)}${contextBlock(projectContext)}L1 quick stats (informational only — do NOT repeat L1 issues here):
${l1Summary}

Figma tree summary:
${treeSummary}

Respond as JSON matching:
${schema}` },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    },
  ];
}

export function l3Messages({ imageUrl, treeSummary, projectContext, reviewScope, scopeBlurb }) {
  const system = `${COMMON_FRAMING}

You are running LEVEL 3 — Cross-Segment / Cross-Team Coherence.
You DO NOT have full visibility into other teams' current designs. So your
job is NOT to judge "right or wrong" — it is to surface FLAGS:

  "I noticed X, which may overlap or conflict with [People / Local / Video
   / TV / Shopping / News / standard Algo results]. Recommend looping in
   [team] before next stage."

Each flag must point to a concrete element / pattern in this design and
name the segment/team the reviewer should sync with. If nothing is risky,
return an empty flags array — do NOT invent issues.

For every flag you MUST include a "nodeId" taken verbatim from the
[id=…] tag. Pick the SMALLEST / MOST SPECIFIC node the flag concerns —
the actual button / label / card you're worried about. Do NOT default
to the root frame or an outer wrapper.`;

  const schema = `{
  "summary": "1 sentence on cross-team risk level (low | medium | high)",
  "risk":   "low | medium | high",
  "flags": [
    {
      "title": "short label",
      "observation": "what you saw in the design",
      "potentialConflict": "what segment/team this might collide with and why",
      "suggestedPartners": ["team name", "..."],
      "confidence": "low | medium | high",
      "nodeId": "the [id=...] from the tree summary that this flag points at — MUST be the specific module/card the observation is about, NOT the root frame. Omit only if truly file-wide."
    }
  ]
}`;

  return [
    { role: "system", content: system },
    {
      role: "user",
      content: [
        { type: "text", text:
`Rendered design + Figma tree summary below. Surface cross-team coherence
flags only.

${structuralScopeBlock(scopeBlurb)}${scopeBlock(reviewScope)}${contextBlock(projectContext)}Figma tree summary:
${treeSummary}

Respond as JSON matching:
${schema}` },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    },
  ];
}
