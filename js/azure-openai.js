// LLM chat-completions client.
//
// Supports two providers, selected by `cfg.provider`:
//   "azure"   — Azure OpenAI deployment (the original path)
//   "copilot" — Microsoft-internal GitHub Copilot proxy
//                (api.githubcopilot.com), reached via serve.py's
//                /copilot/* endpoint which handles GH device-flow
//                token exchange. Browser never sees the GH token.
// Both routes go through the local serve.py to avoid CORS and so
// secrets/headers stay server-side.

// Models that follow the GPT-5 / o-series parameter schema:
//   - max_completion_tokens instead of max_tokens
//   - temperature pinned to 1 (omit)
//   - reasoning_effort supported (we use "low" to leave room for JSON)
function isReasoningModel(name) {
  return /(^|[-_/])(gpt-?5|o[134]|claude-opus-?4|claude-sonnet-?4-?5)/i.test(name || "");
}

export async function chatCompletion(cfg, messages, opts = {}) {
  if (cfg?.provider === "copilot") return _callCopilot(cfg, messages, opts);
  return _callAzure(cfg, messages, opts);
}

// Detect VibeHub host so we can route through its API Connections
// proxy instead of serve.py (which doesn't run on VibeHub).
const IS_VIBEHUB = typeof location !== "undefined"
  && location.hostname.endsWith("vibehub.microsoft.com");

// ---------- Azure OpenAI ----------
async function _callAzure(cfg, messages, { maxTokens = 1500, temperature = 0.2 } = {}) {
  const apiVersion = cfg.apiVersion || "2024-08-01-preview";
  const reasoning = isReasoningModel(cfg.deployment);
  const body = { messages, response_format: { type: "json_object" } };
  if (reasoning) {
    body.max_completion_tokens = Math.max(maxTokens, 6000);
    body.reasoning_effort = "low";
  } else {
    body.max_tokens = maxTokens;
    body.temperature = temperature;
  }
  // On VibeHub, the endpoint and api-key live in the project's
  // `azure-openai` API Connection — base URL = the user's Azure
  // endpoint, credential = the api-key sent as Custom Header `api-key`.
  // We only forward the deployment name from settings.
  const url = IS_VIBEHUB
    ? `/api/proxy/azure-openai/openai/deployments/${encodeURIComponent(cfg.deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`
    : `/azure/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
  const headers = IS_VIBEHUB
    ? { "Content-Type": "application/json" }
    : {
        "Content-Type": "application/json",
        "X-Azure-Endpoint": cfg.endpoint,
        "X-Azure-Deployment": cfg.deployment,
        "X-Azure-Key": cfg.apiKey,
      };
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Azure OpenAI ${res.status}: ${text.slice(0, 300)}`);
  }
  return _extractJson(await res.json(), "Azure OpenAI");
}

// ---------- GitHub Copilot proxy ----------
async function _callCopilot(cfg, messages, { maxTokens = 1500, temperature = 0.2 } = {}) {
  if (IS_VIBEHUB) {
    throw new Error("Copilot provider is not available on VibeHub (requires serve.py for device-flow auth). Switch to Azure OpenAI in Settings.");
  }
  const model = (cfg.model || "gpt-4o").trim();
  const reasoning = isReasoningModel(model);
  const body = { model, messages, response_format: { type: "json_object" } };
  if (reasoning) {
    body.max_completion_tokens = Math.max(maxTokens, 6000);
    // Copilot proxy accepts but doesn't require reasoning_effort; leaving
    // it off keeps payloads compatible with non-reasoning models too.
  } else {
    body.max_tokens = maxTokens;
    body.temperature = temperature;
  }
  const res = await fetch("/copilot/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Copilot-Token": cfg.copilotToken || "",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Copilot ${res.status}: ${text.slice(0, 300)}`);
  }
  return _extractJson(await res.json(), "Copilot");
}

// ---------- shared JSON extractor ----------
function _extractJson(data, providerLabel) {
  const choice = data.choices?.[0];
  const content = choice?.message?.content;
  if (!content) {
    const reason = choice?.finish_reason || "unknown";
    throw new Error(`${providerLabel} returned no content (finish_reason=${reason}). Try a larger token budget or a non-reasoning model.`);
  }
  if (choice?.finish_reason === "length") {
    throw new Error("Model output truncated by token limit. Raise maxTokens, lower reasoning_effort, or pick a smaller schema.");
  }
  try {
    return JSON.parse(content);
  } catch {
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    try { return JSON.parse(stripped); } catch {}
    const m = stripped.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch {}
    }
    throw new Error("Model output was not valid JSON: " + content.slice(0, 300));
  }
}

export function imagePart(url) {
  return { type: "image_url", image_url: { url } };
}

export function textPart(text) {
  return { type: "text", text };
}
