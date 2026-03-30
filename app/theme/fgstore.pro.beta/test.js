// fingerprintPro.js
export async function generateFingerprint() {
  const components = {};

  // Session ID (persistent)
  components.sessionId =
    localStorage.getItem("device_fp") ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("device_fp", id);
      return id;
    })();

  // Canvas entropy
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.fillText("Fingerprinting Test 12345", 2, 2);
  components.canvasHash = canvas.toDataURL().slice(-40);

  // WebGL GPU entropy
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl) {
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    components.gpuVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL);
    components.gpuRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
  }

  // Audio entropy
  const ac = new OfflineAudioContext(1, 44100, 44100);
  const osc = ac.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(2300, ac.currentTime);
  osc.connect(ac.destination);
  osc.start(0);
  const buffer = await ac.startRendering();
  components.audioHash = buffer.getChannelData(0).slice(0, 50).join("");

  // Hardware info
  components.cores = navigator.hardwareConcurrency;
  components.ram = navigator.deviceMemory;

  // Network info
  components.net = navigator.connection?.effectiveType;
  
  // System info
  components.platform = navigator.platform;
  components.userAgent = navigator.userAgent;

  // Timezone
  components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Build final hash
  const raw = JSON.stringify(components);
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hexHash = [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2, "0")).join("");

  return {
    fp: hexHash,
    meta: components,
  };
}
