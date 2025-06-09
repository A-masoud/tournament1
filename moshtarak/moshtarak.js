import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

/* ---------- تنظیمات Firebase ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyC5mI93Gj8Oo73OLFMdoRExN46Ffcr1AQ4",
  authDomain: "tournify-app.firebaseapp.com",
  projectId: "tournify-app",
  storageBucket: "firenotify-app.appspot.com",
  messagingSenderId: "273027702239",
  appId: "1:273027702239:web:ae13272cba831cca2ef86a",
  measurementId: "G-GEKS6X6RCV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- المنت‌های مربوط به منوی کاربری ---------- */
const userButtons = document.querySelector(".buttons");

onAuthStateChanged(auth, async (user) => {
  if (user && userButtons) {
    const uid = user.uid;
    localStorage.setItem("currentUserUID", uid);

    let username = "کاربر";

    try {
      const docRef = doc(db, "UserDataList", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        username = userData.username || "کاربر";
        localStorage.setItem("currentUsername", username);
      }
    } catch (error) {
      console.error("خطا در دریافت یوزرنیم از Firestore:", error);
    }

    userButtons.innerHTML = `
      <p>${username} سلام خوش اومدی!</p>
      <div>
        <button id="logoutBtn">خروج</button>
        <a href="../user-panel/user-panel.html">
          <button>پنل کاربری</button>
        </a>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          localStorage.clear();
          location.reload();
          window.location.href = "../home/home.html";
        })
        .catch((error) => {
          console.error("خطا در خروج:", error);
          alert("مشکلی در خروج پیش آمد.");
        });
    });
  }
});

/* ---------- منوی همبرگری و ساب‌منو ---------- */
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector("nav");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navMenu.classList.toggle("active");
  });
}

document.querySelectorAll(".has-submenu > a").forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const parent = this.parentElement;

    document.querySelectorAll(".has-submenu").forEach(el => {
      if (el !== parent) {
        el.classList.remove("open-submenu");
      }
    });

    parent.classList.toggle("open-submenu");
  });
});
