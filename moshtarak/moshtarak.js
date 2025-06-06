// moshtarak.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// مقداردهی Firebase
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

// پیدا کردن div مربوط به دکمه‌ها
const userButtons = document.querySelector(".buttons");

onAuthStateChanged(auth, (user) => {
  if (user && userButtons) {
    const username = localStorage.getItem("currentUsername") || "کاربر";

    // ذخیره uid در localStorage
    localStorage.setItem("currentUserUID", user.uid);

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
      signOut(auth).then(() => {
        localStorage.clear();
        location.reload();
      });
    });
  }
});


/////////////////////////////
const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  menu.classList.toggle('active');
});

document.querySelectorAll('.has-submenu > a').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault(); // جلوگیری از رفتن به لینک
    const parent = this.parentElement;

    // بستن همه‌ی ساب‌منوها به جز مورد کلیک‌شده
    document.querySelectorAll('.has-submenu').forEach(el => {
      if (el !== parent) {
        el.classList.remove('open-submenu');
      }
    });

    // باز یا بسته کردن ساب‌منوی مورد نظر
    parent.classList.toggle('open-submenu');
  });
});

