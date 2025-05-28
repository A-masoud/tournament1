import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// کانفیگ Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5mI93Gj8Oo73OLFMdoRExN46Ffcr1AQ4",
  authDomain: "tournify-app.firebaseapp.com",
  projectId: "tournify-app",
  storageBucket: "tournify-app.firebasestorage.app",
  messagingSenderId: "273027702239",
  appId: "1:273027702239:web:ae13272cba831cca2ef86a",
  measurementId: "G-GEKS6X6RCV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// اضافه کردن تعریف متغیرهای مورد نیاز در ابتدای فایل
const svg = document.getElementById("pas");
const svg1 = document.getElementById("pas1");
const passwordInput = document.getElementById("password");
const passwordInput2 = document.getElementById("passwordAgain");

// مدیریت نمایش/مخفی کردن رمز عبور
svg.addEventListener("click", function() {
  this.classList.toggle("close");
  setTimeout(() => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }, 125);
});

svg1.addEventListener("click", function() {
  this.classList.toggle("close");
  setTimeout(() => {
    passwordInput2.type = passwordInput2.type === "password" ? "text" : "password";
  }, 125);
});



// افزودن کلاس active به تمام player-group
document.querySelectorAll('.player-group').forEach(element => {
  element.classList.add('active');
});



// هندل ثبت‌نام
document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const passwordAgain = document.getElementById("passwordAgain").value;
  const email = document.getElementById("email").value.trim();
  const agree = document.getElementById("agree").checked;
  const spinner = document.getElementById("spinner");

  if (!fullName || !username || !password || !passwordAgain || !email) {
    alert("لطفاً همه فیلدها را پر کنید.");
    return;
  }

  if (!agree) {
    alert("برای ثبت‌نام باید قوانین را بپذیرید.");
    return;
  }

  if (password !== passwordAgain) {
    alert("رمز عبور و تکرار آن یکسان نیست!");
    return;
  }

  spinner.style.display = "block"; // نمایش لودینگ

  try {
    await addDoc(collection(db, "UserDataList"), {
      fullName,
      username,
      password,
      email,
      createdAt: new Date()
    });

    alert("ثبت‌نام با موفقیت انجام شد!");
    window.location.href = "login.html";
  } catch (err) {
    alert("خطا در ذخیره اطلاعات: " + err.message);
  } finally {
    spinner.style.display = "none"; // مخفی‌سازی لودینگ
  }
});