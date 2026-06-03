// GitHub device-flow client used by the Settings panel.
//
// Browser CAN'T call github.com/login/device/* directly (CORS), so we
// route through serve.py's /copilot/login/start and /copilot/login/poll
// endpoints — they're thin pass-throughs that add the VS Code editor
// headers GitHub expects.
//
// On success the resulting ghu_... user token lives in the visitor's
// own localStorage and is sent as `X-Copilot-Token` on every Copilot
// chat-completions call. Each visitor authorizes their own GitHub
// account; there is no shared server-side token.

export async function startDeviceFlow() {
  const r = await fetch("/copilot/login/start", { method: "POST" });
  const data = await r.json();
  if (!r.ok || data.error) {
    throw new Error(data.error_description || data.error || `start failed: ${r.status}`);
  }
  return data; // { user_code, device_code, verification_uri, interval, expires_in }
}

// Poll until GitHub returns a token, the code expires, or the caller
// cancels via the AbortSignal. `onUpdate({phase})` is fired on phase
// changes so the UI can re-render ("waiting" / "denied" / "expired").
export async function pollDeviceFlow({ device_code, interval, expires_in }, { onUpdate, signal } = {}) {
  const deadline = Date.now() + (expires_in || 900) * 1000;
  let cur = Math.max(5, interval || 5);
  while (Date.now() < deadline) {
    if (signal?.aborted) throw new Error("cancelled");
    await sleep(cur * 1000, signal);
    let resp;
    try {
      const r = await fetch("/copilot/login/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_code }),
        signal,
      });
      resp = await r.json();
    } catch (e) {
      if (e.name === "AbortError") throw new Error("cancelled");
      throw e;
    }
    if (resp.access_token) return resp.access_token;
    switch (resp.error) {
      case "authorization_pending":
        onUpdate?.({ phase: "waiting" }); continue;
      case "slow_down":
        cur += 5; onUpdate?.({ phase: "waiting" }); continue;
      case "expired_token":
        throw new Error("Device code expired. Click Sign in again.");
      case "access_denied":
        throw new Error("Authorization denied.");
      default:
        throw new Error(resp.error_description || resp.error || "Unknown poll error");
    }
  }
  throw new Error("Device code expired before authorization.");
}

// Fetch the model catalog from the Copilot proxy (filtered to what
// THIS user's subscription tier actually allows). Used to populate
// the model dropdown so we never offer something that will 404.
//
// Returns an array of:
//   { id, name, vendor, vision, maxOutputTokens, chatEnabled }
// Throws on network / auth failure.
export async function fetchCopilotModels(token) {
  const r = await fetch("/copilot/models", {
    method: "GET",
    headers: { "X-Copilot-Token": token || "" },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`models ${r.status}: ${text.slice(0, 200)}`);
  }
  const data = await r.json();
  const raw = Array.isArray(data?.data) ? data.data : [];
  return raw.map(m => {
    const sup = m?.capabilities?.supports || {};
    const lim = m?.capabilities?.limits || {};
    return {
      id: m.id,
      name: m.name || m.id,
      vendor: m.vendor || "Other",
      vision: !!sup.vision,
      maxOutputTokens: lim.max_output_tokens || lim.max_completion_tokens || null,
      chatEnabled: m.model_picker_enabled !== false &&
                   (m?.capabilities?.type === "chat" || !m?.capabilities?.type),
    };
  });
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => resolve(), ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new Error("cancelled"));
    });
  });
}
