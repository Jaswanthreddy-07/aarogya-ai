(function () {
  if (!ArogyaAPI.requireAuth()) return;
  const user = JSON.parse(localStorage.getItem("arogya_user") || "{}");
  const date = document.querySelector(".date-box");
  if (date) date.textContent = new Date().toLocaleDateString(undefined, { dateStyle: "full" });

  function score(reading) {
    return reading?.wellnessScore ?? (reading ? Math.min(100, Math.round((reading.heartRate ? 40 : 0) + (reading.spo2 ? reading.spo2 / 2 : 0))) : "--");
  }

  async function load() {
    try {
      const [profile, latest, medicines] = await Promise.all([
        ArogyaAPI.request("/users/profile"),
        ArogyaAPI.request("/health/latest"),
        ArogyaAPI.request("/medicines")
      ]);
      const cards = document.querySelectorAll(".health-box h2");
      if (cards[0]) cards[0].textContent = `${score(latest)}/100`;
      if (cards[1]) cards[1].textContent = latest?.heartRate ? `${latest.heartRate} BPM` : "-- BPM";
      if (cards[2]) cards[2].textContent = "-- hrs";
      if (cards[3]) cards[3].textContent = "--";
      const medicinePanel = document.querySelectorAll(".panel")[1];
      if (medicinePanel) {
        const items = medicines.slice(0, 3).map((medicine) => `<div class="medicine"><div><strong>${medicine.name}</strong><small>${medicine.time}${medicine.dosage ? ` · ${medicine.dosage}` : ""}</small></div><span class="${medicine.takenAt ? "taken" : "pending"}">${medicine.takenAt ? "✓ Taken" : "Pending"}</span></div>`).join("");
        medicinePanel.querySelectorAll(".medicine").forEach((item) => item.remove());
        medicinePanel.insertAdjacentHTML("beforeend", items || `<p class="muted">No medicines added yet.</p>`);
      }
      const familyPanel = document.querySelectorAll(".panel")[2];
      if (familyPanel) {
        const members = [{ name: profile.name, relation: "Primary User" }, ...(profile.familyMembers || [])];
        familyPanel.querySelectorAll(".family-row").forEach((item) => item.remove());
        familyPanel.insertAdjacentHTML("beforeend", members.slice(0, 4).map((member) => `<div class="family-row"><div class="avatar">${member.name?.[0] || "?"}</div><div class="family-info"><strong>${member.name}</strong><small>${member.relation || "Family Member"}</small></div><span class="online">● Active</span></div>`).join(""));
      }
    } catch (error) { ArogyaAPI.showError(error); }
  }
  load();
})();
