(function () {
  if (!ArogyaAPI.requireAuth()) return;
  const grid = document.querySelector(".members-grid");
  const header = document.querySelector(".family-header");
  if (!grid) return;
  const form = document.createElement("form");
  form.className = "inline-form family-form";
  form.hidden = true;
  form.innerHTML = `<input name="name" placeholder="Name" required><input name="age" type="number" placeholder="Age"><input name="gender" placeholder="Gender"><input name="relation" placeholder="Relation" required><button class="primary-btn" type="submit">Save member</button>`;
  header.append(form);
  const toggle = header.querySelector(".add-btn");
  toggle.addEventListener("click", (event) => { event.preventDefault(); form.hidden = !form.hidden; });
  form.addEventListener("submit", async (event) => { event.preventDefault(); try { await ArogyaAPI.request("/users/family", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); form.hidden = true; await load(); } catch (error) { ArogyaAPI.showError(error); } });
  async function load() {
    try {
      const profile = await ArogyaAPI.request("/users/profile");
      const members = [{ name: profile.name, relation: "Primary User", primary: true }, ...(profile.familyMembers || [])];
      grid.innerHTML = members.map((member) => `<article class="member-card"><div class="member-top"><div class="member-avatar">${member.name?.[0] || "?"}</div><div class="member-name"><h2>${member.name}</h2><p>${member.relation || "Family Member"}</p><span class="active">● Active</span></div></div><div class="member-stats"><div class="stat"><small>Age</small><strong>${member.age || "--"}</strong></div><div class="stat"><small>Gender</small><strong>${member.gender || "--"}</strong></div><div class="stat"><small>Status</small><strong>Active</strong></div><div class="stat"><small>Care</small><strong>Monitored</strong></div></div><button class="view-btn" type="button">View health details</button></article>`).join("");
    } catch (error) { ArogyaAPI.showError(error); }
  }
  load();
})();
