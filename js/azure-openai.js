// Azure OpenAI chat-completions client.
//
// Calls go through the local proxy bundled in serve.py to avoid CORS.
// Browser → /azure/chat/completions?api-version=... (same origin)
//   serve.py forwards to:
//     {endpoint}/openai/deployments/{deployment}/chat/completions?api-version=...
// Endpoint / deployment / key travel in custom headers; the proxy injects
// them when forwarding. Nothing is persisted on the proxy side.

export async function chatCompletion(cfg, messages, { maxTokens = 1500, temperature = 0.2 } = {}) {
  const apiVersion = cfg.apiVersion || "2024-08-01-preview";
  const url = `/azure/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Azure-Endpoint": cfg.endpoint,
      "X-Azure-Deployment": cfg.deployment,
      "X-Azure-Key": cfg.apiKey,
    },
    body: JSON.stringify({
      messages,
      max_tokens: maxTokens,
      temperature,
      response_format: { type: "json_object" },
    }),
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
