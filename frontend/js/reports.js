(function () {
  if (!ArogyaAPI.requireAuth()) return;
  const cards = document.querySelectorAll(".report-card h2");
  const bars = document.querySelectorAll(".trend-bar");
  const generate = document.querySelector(".generate-btn");
  async function load() {
    try {
      const report = await ArogyaAPI.request("/reports");
      if (cards[0]) cards[0].textContent = report.averageHeartRate ? `${report.averageHeartRate} BPM` : "--";
      if (cards[1]) cards[1].textContent = report.averageSpo2 ? `${report.averageSpo2}%` : "--";
      if (cards[2]) cards[2].textContent = report.totalRecords;
      if (cards[3]) cards[3].textContent = new Date(report.generatedAt || Date.now()).toLocaleDateString();
      const values = (report.records || []).slice(0, 7).reverse().map((item) => item.wellnessScore || 60);
      bars.forEach((bar, index) => { bar.style.height = `${values[index] || 30}%`; });
    } catch (error) { ArogyaAPI.showError(error); }
  }
  generate?.addEventListener("click", async () => { ArogyaAPI.setLoading(generate, true, "Generating..."); await load(); ArogyaAPI.setLoading(generate, false); });
  window.generateReport = load;
  window.viewReport = () => load();
  load();
})();
