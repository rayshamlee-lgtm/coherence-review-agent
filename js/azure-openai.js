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
    body.max_completion_tokens = maxTokens;
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
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Azure OpenAI returned no content.");
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}$/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Model output was not valid JSON: " + content.slice(0, 200));
  }
}

export function imagePart(url) {
  return { type: "image_url", image_url: { url } };
}

export function textPart(text) {
  return { type: "text", text };
}
