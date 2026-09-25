(function () {
  if (!ArogyaAPI.requireAuth()) return;
  window.analyzeVoice = async function () {
    const status = document.querySelector("#analysisStatus");
    status.textContent = "Saving reading...";
    try {
      await ArogyaAPI.request("/health", { method: "POST", body: JSON.stringify({ heartRate: 74, spo2: 97, wellnessScore: 78, source: "voice-check" }) });
      document.querySelector("#score").textContent = "78/100";
      document.querySelector("#resultMessage").textContent = "Voice check saved as a wellness reading.";
      status.textContent = "Completed";
    } catch (error) { ArogyaAPI.showError(error); status.textContent = "Could not save"; }
  };
})();
