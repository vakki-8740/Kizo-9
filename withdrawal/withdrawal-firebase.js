import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "../firebase-config.js";

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  window.__sendComplaint = (data) =>
    addDoc(collection(db, "complaints"), data).then((ref) => ref.id);

  window.__watchSettings = (onSettings) =>
    onSnapshot(
      doc(db, "settings", "app"),
      (snap) => onSettings(snap.exists() ? snap.data() : {}),
      () => onSettings({})
    );

  window.__sendTelegram = async (token, chatId, text) => {
    const res = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      body: new URLSearchParams({ chat_id: chatId, text }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.ok) {
      console.warn("Telegram alert failed:", (data && data.description) || res.status);
      return false;
    }
    return true;
  };
} catch (err) {
  console.warn("Firebase init failed:", err);
}
