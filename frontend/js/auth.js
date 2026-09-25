(function () {
  const form = document.querySelector("#authForm");
  if (!form) return;

  const modeToggle = document.querySelector("#modeToggle");
  const title = document.querySelector("#authTitle");
  const submit = form.querySelector("button[type=submit]");
  const extraFields = document.querySelector("#registerFields");
  let mode = "login";

  modeToggle.addEventListener("click", () => {
    mode = mode === "login" ? "register" : "login";
    title.textContent = mode === "login" ? "Welcome back" : "Create your health space";
    submit.textContent = mode === "login" ? "Sign in" : "Create account";
    modeToggle.textContent = mode === "login" ? "Create an account" : "I already have an account";
    extraFields.hidden = mode === "login";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    ArogyaAPI.setLoading(submit, true, "Connecting...");

    try {
      if (mode === "register") {
        await ArogyaAPI.request(endpoint, { method: "POST", body: JSON.stringify(data) });
        modeToggle.click();
        form.reset();
        document.querySelector("#authMessage").textContent = "Account created. Sign in to continue.";
        return;
      }

      const result = await ArogyaAPI.request(endpoint, { method: "POST", body: JSON.stringify(data) });
      localStorage.setItem("arogya_token", result.token);
      localStorage.setItem("arogya_user", JSON.stringify(result.user));
      window.location.href = "dashboard.html";
    } catch (error) {
      ArogyaAPI.showError(error);
    } finally {
      ArogyaAPI.setLoading(submit, false);
    }
  });
})();