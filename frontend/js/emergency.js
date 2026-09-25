(function () {
  if (!ArogyaAPI.requireAuth()) return;
  const contacts = document.querySelector(".contacts");
  const alertButton = document.querySelector(".emergency-btn");
  const card = document.querySelector(".alert-card");
  const form = document.createElement("form");
  form.className = "inline-form contact-form";
  form.innerHTML = `<input name="name" placeholder="Contact name" required><input name="phone" type="tel" placeholder="+919876543210" pattern="\\+91[6-9]\\d{9}" title="Use Indian format: +919876543210" required><input name="relation" placeholder="Relation"><button class="secondary-btn" type="submit">Add contact</button>`;
  card?.append(form);
  form.addEventListener("submit", async (event) => { event.preventDefault(); try { await ArogyaAPI.request("/emergency/contacts", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); await load(); } catch (error) { ArogyaAPI.showError(error); } });
  async function load() {
    try {
      const data = await ArogyaAPI.request("/emergency/contacts");
      contacts.innerHTML = data.length ? data.map((contact) => `<div class="contact" data-id="${contact._id}"><div class="contact-icon">📱</div><strong>${contact.name}</strong><small>${contact.relation || "Emergency contact"} · ${contact.phone}</small><button class="text-btn delete-contact" type="button">Remove</button></div>`).join("") : `<p class="muted">No emergency contacts configured yet.</p>`;
    } catch (error) { ArogyaAPI.showError(error); }
  }
  contacts.addEventListener("click", async (event) => { const button = event.target.closest(".delete-contact"); if (!button) return; try { await ArogyaAPI.request(`/emergency/contacts/${button.closest("[data-id]").dataset.id}`, { method: "DELETE" }); await load(); } catch (error) { ArogyaAPI.showError(error); } });
  alertButton?.addEventListener("click", async () => {
    if (!confirm("Send an emergency SMS to every saved contact now?")) return;
    const status = document.querySelector("#emergencyStatus");
    ArogyaAPI.setLoading(alertButton, true, "Sending...");
    try {
      const result = await ArogyaAPI.request("/emergency/sos", { method: "POST" });
      status.textContent = result.message;
      status.dataset.state = result.status;
    } catch (error) {
      status.textContent = error.message;
      status.dataset.state = "failed";
    } finally {
      ArogyaAPI.setLoading(alertButton, false);
    }
  });
  load();
})();
