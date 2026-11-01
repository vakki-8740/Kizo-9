import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  window.__watchSettings = (onSettings) =>
    onSnapshot(
      doc(db, "settings", "app"),
      (snap) => onSettings(snap.exists() ? snap.data() : {}),
      () => onSettings({})
    );
} catch (err) {
  console.warn("Firebase init failed:", err);
}
