(function () {
  const API_BASE = "/api";

  async function request(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = localStorage.getItem("arogya_token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("arogya_token");
        localStorage.removeItem("arogya_user");
      }
      throw new Error(body.message || "Something went wrong. Please try again.");
    }

    return body;
  }

  function requireAuth() {
    if (!localStorage.getItem("arogya_token")) {
      window.location.href = "auth.html";
      return false;
    }
    return true;
  }

  function logout() {
    localStorage.removeItem("arogya_token");
    localStorage.removeItem("arogya_user");
    window.location.href = "auth.html";
  }

  function showError(error) {
    const message = error instanceof Error ? error.message : String(error);
    let element = document.querySelector("[data-api-error]");
    if (!element) {
      element = document.createElement("div");
      element.dataset.apiError = "true";
      element.className = "api-error";
      document.body.prepend(element);
    }
    element.textContent = message;
    element.hidden = false;
  }

  function setLoading(element, loading, text) {
    if (!element) return;
    element.disabled = loading;
    if (loading) {
      element.dataset.originalText = element.textContent;
      element.textContent = text || "Working...";
    } else if (element.dataset.originalText) {
      element.textContent = element.dataset.originalText;
    }
  }

  window.ArogyaAPI = { request, requireAuth, logout, showError, setLoading };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".login-btn").forEach((button) => {
      if (localStorage.getItem("arogya_token")) {
        button.textContent = "Sign out";
        button.addEventListener("click", logout);
      } else {
        button.addEventListener("click", () => { window.location.href = "auth.html"; });
      }
    });
  });
})();