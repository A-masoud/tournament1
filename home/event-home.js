// firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 🔧 تنظیمات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5mI93Gj8Oo73OLFMdoRExN46Ffcr1AQ4",
  authDomain: "tournify-app.firebaseapp.com",
  projectId: "tournify-app",
  storageBucket: "tournify-app.firebasestorage.app",
  messagingSenderId: "273027702239",
  appId: "1:273027702239:web:ae13272cba831cca2ef86a",
  measurementId: "G-GEKS6X6RCV"
};

// 🔌 اتصال به Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎯 تابع بارگذاری آخرین رویداد
function loadLatestEventStatus() {
  const countdownEl = document.getElementById("countdown");
  const mapNameEl = document.getElementById("map-name");
  const matchStatusEl = document.getElementById("match-status");
  const serverEl = document.getElementById("server");
  const registeredTeamsEl = document.getElementById("registered-teams");
  const emptySlotsEl = document.getElementById("empty-slots");

  // 🟡 مرحله ۱: دریافت آخرین رویداد
  const q = query(collection(db, "events"), orderBy("startTime", "desc"), limit(1));

  onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const ev = snapshot.docs[0].data();
      const startTime = ev.startTime.toDate();

      // ⏳ شمارش معکوس
      const interval = setInterval(() => {
        const diff = startTime - new Date();

        if (diff <= 0) {
          countdownEl.textContent = "مسابقه شروع شده!";
          matchStatusEl.textContent = "در حال اجرا";
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdownEl.textContent = `${hours}ساعت ${minutes}دقیقه ${seconds}ثانیه`;
        matchStatusEl.textContent = "منتظر شروع";
      }, 1000);

      mapNameEl.textContent = ev.map || "نامشخص";
      serverEl.textContent = ev.server || "نامشخص";

    } else {
      countdownEl.textContent = "رویدادی یافت نشد";
      mapNameEl.textContent = "-";
      matchStatusEl.textContent = "-";
    }
  });

  // 🟢 مرحله ۲: دریافت اطلاعات teamStats/counts
  const statsDocRef = doc(db, "teamStats", "counts");

  onSnapshot(statsDocRef, (statsDoc) => {
    if (statsDoc.exists()) {
      const data = statsDoc.data();
      registeredTeamsEl.textContent = data.registeredTeams ?? "نامشخص";
      emptySlotsEl.textContent = data.availableTeams ?? "نامشخص";
    } else {
      registeredTeamsEl.textContent = "نامشخص";
      emptySlotsEl.textContent = "نامشخص";
    }
  });
}

loadLatestEventStatus(); // 🚀 اجرای تابع هنگام بارگذاری
