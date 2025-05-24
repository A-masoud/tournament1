// Import ماژول‌های لازم از Firebase نسخه ۹
console.log("...اسکریپت لود شد")
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// تنظیمات Firebase (اطلاعات پروژه خودتو بذار)
const firebaseConfig = {
  apiKey: "AIzaSyC5mI93Gj8Oo73OLFMdoRExN46Ffcr1AQ4",
  authDomain: "tournify-app.firebaseapp.com",
  projectId: "tournify-app",
  storageBucket: "tournify-app.firebasestorage.app",
  messagingSenderId: "273027702239",
  appId: "1:273027702239:web:ae13272cba831cca2ef86a",
  measurementId: "G-GEKS6X6RCV"
};

// Initialize Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function setupEventSteps() {
  // المان‌ها
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  const startTimeInput = document.getElementById("event-start-time");
  const mapSelect = document.getElementById("event-map");

  const step1NextBtn = document.getElementById("step1-next");
  const step2NextBtn = document.getElementById("step2-next");
  const saveEventBtn = document.getElementById("save-event");

  const confirmStart = document.getElementById("confirm-start");
  const confirmMap = document.getElementById("confirm-map");
  let confirmServer = document.getElementById("confirm-server");

  const eventHistory = document.getElementById("event-history");

  // مرحله سرور (مرحله 3 به بعد)
  const step3Content = document.createElement("div");
  step3Content.innerHTML = `
    <label>🌐 انتخاب سرور:</label>
    <select id="event-server">
      <option value="Europe">Europe</option>
      <option value="Asia">Asia</option>
      <option value="MiddleEast">MiddleEast</option>
    </select>
    <button id="step3-next">مرحله بعد</button>
  `;
  step3.insertBefore(step3Content, saveEventBtn);

  const serverSelect = document.getElementById("event-server");
  const step3NextBtn = document.getElementById("step3-next");

  // جلوگیری از انتخاب زمان گذشته
  const nowISO = new Date().toISOString().slice(0, 16);
  startTimeInput.min = nowISO;

  // دکمه ثبت ابتدا مخفی باشه
  saveEventBtn.style.display = "none";

  // مدیریت مراحل فرم
  step1NextBtn.onclick = () => {
    if (!startTimeInput.value) {
      alert("لطفا زمان شروع رو انتخاب کن");
      return;
    }
    step1.style.display = "none";
    step2.style.display = "block";
  };

  step2NextBtn.onclick = () => {
    step2.style.display = "none";
    step3.style.display = "block";
  };

  step3NextBtn.onclick = () => {
    if (!serverSelect.value) {
      alert("لطفا سرور رو انتخاب کن");
      return;
    }
    confirmStart.textContent = new Date(startTimeInput.value).toLocaleString();
    confirmMap.textContent = mapSelect.value;

    if (!confirmServer) {
      const serverConfirmP = document.createElement("p");
      serverConfirmP.innerHTML = `🌐 سرور: <span id="confirm-server"></span>`;
      step3.insertBefore(serverConfirmP, saveEventBtn);
      confirmServer = document.getElementById("confirm-server");
    }
    confirmServer.textContent = serverSelect.value;

    step3NextBtn.style.display = "none";
    saveEventBtn.style.display = "inline-block";
  };

  // ذخیره رویداد در Firestore
  saveEventBtn.onclick = async () => {
    saveEventBtn.disabled = true;
    try {
      await addDoc(collection(db, "events"), {
        startTime: Timestamp.fromDate(new Date(startTimeInput.value)),
        map: mapSelect.value,
        server: serverSelect.value,
        createdAt: serverTimestamp()
      });
      alert("رویداد با موفقیت ثبت شد ✅");
      resetForm();
    } catch (error) {
      alert("خطا در ثبت رویداد: " + error.message);
    }
    saveEventBtn.disabled = false;
  };

  // ریست کردن فرم برای ثبت رویداد جدید
  function resetForm() {
    startTimeInput.value = "";
    mapSelect.value = "Dust2";
    serverSelect.value = "Europe";

    step1.style.display = "block";
    step2.style.display = "none";
    step3.style.display = "none";

    step3NextBtn.style.display = "inline-block";
    saveEventBtn.style.display = "none";

    confirmStart.textContent = "";
    confirmMap.textContent = "";
    if (confirmServer) confirmServer.textContent = "";
  }

  // نمایش لحظه‌ای لیست رویدادها
  const q = query(collection(db, "events"), orderBy("startTime", "desc"));
  onSnapshot(q, (snapshot) => {
    eventHistory.innerHTML = "";
    snapshot.forEach((doc) => {
      const ev = doc.data();
      const li = document.createElement("li");
      li.textContent = `⏰ ${ev.startTime.toDate().toLocaleString()} | 🗺️ ${ev.map} | 🌐 ${ev.server}`;
      eventHistory.appendChild(li);
    });
  });
}

// اجرای تابع برای راه‌اندازی فرم و مدیریت مراحل
setupEventSteps();
