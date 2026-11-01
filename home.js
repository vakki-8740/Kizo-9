const PAGE_PREFIX = "";

const toastEl = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
}

let settingsData = null;

function applySettings(data) {
  settingsData = data || {};
}

function startSettingsWatch(tries) {
  const n = tries || 0;

  if (typeof window.__watchSettings === "function") {
    window.__watchSettings(applySettings);
    return;
  }

  if (n < 60) setTimeout(() => startSettingsWatch(n + 1), 500);
}

function openLiveChat() {
  if (!settingsData) {
    showToast("Please wait a moment and try again.");
    return;
  }

  const url = String(settingsData.chatUrl || "").trim();

  if (!url || /^(javascript|data|vbscript):/i.test(url)) {
    showToast("Live chat is not available right now. Please send a complaint.");
    return;
  }

  // Admin panel me set kiye gaye Live Chat link par redirect karo.
  let target = url;
  if (!/^https?:\/\//i.test(target) && !target.startsWith("/") && !target.startsWith("../")) {
    target = PAGE_PREFIX + target;
  }
  window.location.href = target;
}

// Menu: button header ke right side me hai, menu left side se khulta hai.
const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");

function openMenu() {
  menuOverlay.classList.add("show");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menuOverlay.classList.remove("show");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
document.getElementById("menuClose").addEventListener("click", closeMenu);

menuOverlay.addEventListener("click", (e) => {
  if (e.target === menuOverlay) closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

document.querySelectorAll("[data-live-chat]").forEach((btn) => {
  btn.addEventListener("click", openLiveChat);
});

startSettingsWatch();

// Har card par tap karne se sirf usi problem ka complaint page khulega.
const HELP_PAGES = {
  deposit: "deposit/index.html",
  withdrawal: "withdrawal/index.html",
  account: "account/index.html",
};

document.getElementById("homeView").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-help]");
  if (!btn) return;

  if (btn.dataset.help === "livechat") {
    openLiveChat();
  } else {
    window.location.href = HELP_PAGES[btn.dataset.help];
  }
});
