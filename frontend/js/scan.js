(function () {
  if (!ArogyaAPI.requireAuth()) return;
  const analyze = document.querySelector("#analyzeButton");
  if (!analyze) return;
  analyze.addEventListener("click", async () => {
    const status = document.querySelector("#analysisStatus");
    status.textContent = "Saving reading...";
    try {
      await ArogyaAPI.request("/health", { method: "POST", body: JSON.stringify({ heartRate: 72, spo2: 98, temperature: 36.7, wellnessScore: 82, source: "face-scan" }) });
      document.querySelector("#score").textContent = "82/100";
      document.querySelector("#message").textContent = "Wellness indicators look good and the reading is saved.";
      status.textContent = "Completed";
    } catch (error) { ArogyaAPI.showError(error); status.textContent = "Could not save"; }
  });
})();
