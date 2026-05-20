# Coherence Review Agent — Demo

A single-page web demo that takes a Figma link and returns a coherence review
along the three-level rubric from the PRD:

- **Level 1 — Spec compliance.** Walks the Figma node tree and checks colors,
  corners, spacing, and typography against the Bing Design System token
  catalog. Deterministic, no LLM.
- **Level 2 — Application quality.** Sends the rendered frame + a tree
  summary to a vision-capable Azure OpenAI deployment and asks for a
  judgment on Intent / Hierarchy / Usability / Scalability.
- **Level 3 — Cross-team coherence (warnings only).** Asks the LLM to
  surface "you may want to confirm with team X" flags. Never claims
  something is wrong on this layer — per PRD design.

## Architecture

Pure browser app — no backend. All keys live in `localStorage` and all
network calls go straight from the page to:

- `api.figma.com` for node data + frame rendering, and
- your Azure OpenAI deployment for L2 / L3 analysis.

```
demo/
  index.html                # app shell + settings panel
  styles/main.css           # styled with Bing Design System tokens
  js/
    app.js                  # UI controller
    pipeline.js             # parse → L1 → render → L2 → L3 → score
    figma.js                # Figma REST client + tree summarizer
    l1-rules.js             # token-compliance checks
    token-catalog.js        # allowed colors / spacing / radius / type ramps
    azure-openai.js         # chat completions w/ vision + JSON response
    prompts.js              # L2 + L3 prompts
```

## Setup

1. **Figma Personal Access Token.** Figma → Settings → Security →
   Personal access tokens → create one with `file_content:read` (required)
   and `file_comments:write` (optional, only needed to use the "💬 Post
   to Figma" buttons that pin review notes back onto the design).
2. **Azure OpenAI deployment.** Use a vision-capable model
   (gpt-4o / gpt-4.1 / gpt-5). Note your endpoint, deployment name, and key.
3. **Run the bundled dev server.** It serves the static demo AND proxies
   browser → Azure OpenAI to sidestep CORS (Azure OpenAI has no built-in
   CORS toggle, so a thin proxy is the simplest fix). Stdlib only,
   no install:
   ```bash
   cd "Coherence Review Agent/demo"
   python3 serve.py            # http://localhost:8000
   ```
   Open `http://localhost:8000`. The browser will call `/azure/*` and
   `serve.py` forwards to your Azure OpenAI endpoint.
5. Click **⚙ Settings**, paste your Figma token + Azure OpenAI config,
   **Save**.
6. Paste a Figma link (preferably one with `?node-id=...` so the agent
   can render a specific frame) and hit **Review**.

## Notes & limits

- Keys are in `localStorage` and visible to anything that can run JS in this
  origin. Fine for a self-use demo, not safe for shared deployment — if
  you ever host this for others, move LLM + Figma calls behind a backend.
- The token catalog (`token-catalog.js`) is distilled from BingDesignSkill
  V1.2. When the framework team ships new tokens, refresh this file.
- L2 / L3 prompts request strict JSON; if Azure OpenAI returns prose the
  pipeline will surface the parse error in the step list.
- If a Figma URL has no `node-id`, the agent runs L1 on the whole file
  (depth-limited) and skips frame rendering; L2 / L3 then judge from the
  tree summary only.
- Scoring weights (L1 35% / L2 45% / L3 20%) match the WIP scoring system
  in the PRD. Adjust in `pipeline.js` if the rubric changes.
