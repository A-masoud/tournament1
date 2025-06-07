import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

const svg = document.getElementById("pas");
const passwordInput = document.getElementById("password");

svg.addEventListener("click", function() {
  this.classList.toggle("close");
  setTimeout(() => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }, 125);
});

document.querySelectorAll('.player-group').forEach(element => {
  element.classList.add('active');
});

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const spinner = document.getElementById("spinner");
  if (spinner) spinner.style.display = "block"; // نمایش لودینگ

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 1. جستجو در Firestore برای پیدا کردن ایمیل بر اساس username
    const usersRef = collection(db, "UserDataList");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("کاربری با این نام کاربری یافت نشد ❌");
      return;
    }

    let userEmail = null;
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      userEmail = userData.email; // ایمیل مربوط به یوزر نیم
    });

    if (!userEmail) {
      alert("خطا در بازیابی ایمیل کاربر.");
      return;
    }

    // 2. ورود به Firebase Auth با ایمیل پیدا شده و پسورد
    const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
    const user = userCredential.user;

    // ذخیره اطلاعات کاربر در localStorage
    localStorage.setItem("currentUserUid", user.uid);
    localStorage.setItem("currentUserEmail", user.email);
    localStorage.setItem("currentUsername", username);

    alert("شما با موفقیت وارد شدید ✅");
    window.location.href = "../home/home.html";

  } catch (error) {
    console.error("خطا در لاگین:", error);
    alert("رمز عبور اشتباه است یا خطایی رخ داده ❌");
  } finally {
    if (spinner) spinner.style.display = "none"; // مخفی کردن لودینگ
  }
});
