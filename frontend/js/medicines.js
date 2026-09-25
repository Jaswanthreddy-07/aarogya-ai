(function () {
  if (!ArogyaAPI.requireAuth()) return;
  const container = document.querySelector(".medicine-container");
  const addButton = document.querySelector(".add-btn");
  if (!container) return;
  let medicines = [];

  container.innerHTML = `<div class="medicine-title"><h2>Today's schedule</h2><span class="muted" id="medicineCount"></span></div><form id="medicineForm" class="inline-form" hidden><input name="name" placeholder="Medicine name" required><input name="dosage" placeholder="Dosage"><input name="time" type="time" required><input name="frequency" placeholder="Frequency"><button class="primary-btn" type="submit">Save medicine</button></form><div id="medicineList"></div>`;
  const form = document.querySelector("#medicineForm");
  const list = document.querySelector("#medicineList");

  addButton?.addEventListener("click", () => { form.hidden = !form.hidden; if (!form.hidden) form.name.focus(); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try { await ArogyaAPI.request("/medicines", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); form.hidden = true; await load(); }
    catch (error) { ArogyaAPI.showError(error); }
  });

  function render() {
    document.querySelector("#medicineCount").textContent = `${medicines.length} scheduled`;
    list.innerHTML = medicines.length ? medicines.map((medicine) => `<article class="medicine-item" data-id="${medicine._id}"><div class="medicine-icon">💊</div><div class="medicine-info"><h3>${medicine.name}</h3><p>${medicine.dosage || "As prescribed"} · ${medicine.frequency || "Daily"}</p></div><div class="time">${medicine.time}</div><span class="status ${medicine.takenAt ? "taken" : "pending"}">${medicine.takenAt ? "✓ Taken" : "Pending"}</span><button class="action-btn" data-action="${medicine.takenAt ? "delete" : "taken"}">${medicine.takenAt ? "Remove" : "Mark taken"}</button></article>`).join("") : `<div class="empty-state"><strong>Your schedule is clear.</strong><p>Add a medicine to start tracking doses.</p></div>`;
  }
  list.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = button.closest("[data-id]");
    try {
      await ArogyaAPI.request(button.dataset.action === "taken" ? `/medicines/${item.dataset.id}/taken` : `/medicines/${item.dataset.id}`, { method: button.dataset.action === "taken" ? "PATCH" : "DELETE" });
      await load();
    } catch (error) { ArogyaAPI.showError(error); }
  });
  async function load() { try { medicines = await ArogyaAPI.request("/medicines"); render(); } catch (error) { ArogyaAPI.showError(error); } }
  load();
})();
