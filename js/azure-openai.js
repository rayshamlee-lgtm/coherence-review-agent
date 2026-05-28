// Azure OpenAI chat-completions client.
//
// Calls go through the local proxy bundled in serve.py to avoid CORS.
// Browser → /azure/chat/completions?api-version=... (same origin)
//   serve.py forwards to:
//     {endpoint}/openai/deployments/{deployment}/chat/completions?api-version=...
// Endpoint / deployment / key travel in custom headers; the proxy injects
// them when forwarding. Nothing is persisted on the proxy side.

// GPT-5 / o-series style deployments require `max_completion_tokens`
// instead of `max_tokens`, and pin `temperature` to the default (1).
// Detect by deployment name — covers gpt-5*, gpt-5.x, o1, o3, o4.
function isNewParamSchema(deployment) {
  return /(^|[-_/])(gpt-?5|o[134])/i.test(deployment || "");
}

export async function chatCompletion(cfg, messages, { maxTokens = 1500, temperature = 0.2 } = {}) {
  const apiVersion = cfg.apiVersion || "2024-08-01-preview";
  const url = `/azure/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
  const newSchema = isNewParamSchema(cfg.deployment);
  const body = {
    messages,
    response_format: { type: "json_object" },
  };
  if (newSchema) {
    // GPT-5 / o-series count reasoning tokens against
    // max_completion_tokens. The caller-specified budget (~1500) is
    // enough for the JSON answer alone, but the model can burn that
    // entire budget on reasoning and emit a truncated answer (= invalid
    // JSON). Two mitigations:
    //  1) reasoning_effort: "low" trims internal reasoning sharply.
    //  2) Floor the budget at 6000 so even with some reasoning there's
    //     room for the full JSON.
    body.max_completion_tokens = Math.max(maxTokens, 6000);
    body.reasoning_effort = "low";
    // temperature must stay at default (1) for these models — omit it.
  } else {
    body.max_tokens = maxTokens;
    body.temperature = temperature;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Azure-Endpoint": cfg.endpoint,
      "X-Azure-Deployment": cfg.deployment,
      "X-Azure-Key": cfg.apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Azure OpenAI ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content;
  if (!content) {
    // Reasoning models can return finish_reason="length" with empty
    // content when the budget runs out mid-reasoning. Surface that.
    const reason = choice?.finish_reason || "unknown";
    throw new Error(`Azure OpenAI returned no content (finish_reason=${reason}). Try a larger token budget or a non-reasoning model.`);
  }
  if (choice?.finish_reason === "length") {
    // Output was cut off — JSON is almost certainly invalid.
    throw new Error("Model output truncated by token limit. Raise maxTokens, lower reasoning_effort, or pick a smaller schema.");
  }
  try {
    return JSON.parse(content);
  } catch {
    // Strip ```json fences if any.
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    try { return JSON.parse(stripped); } catch {}
    // Last resort: grab the outermost {...} block.
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
