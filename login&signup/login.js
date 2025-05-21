import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
    const querySnapshot = await getDocs(collection(db, "UserDataList"));
    let matchedUser = null;

    querySnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.username === username && user.password === password) {
        matchedUser = user;
      }
    });

    if (matchedUser) {
      localStorage.setItem("currentUser", matchedUser.username);
      alert("شما با موفقیت وارد شدید ✅");
      window.location.href = "../home/home.html";
    } else {
      alert("کاربری با این مشخصات یافت نشد ❌");
    }

  } catch (error) {
    console.error("خطا در لاگین:", error);
    alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
  } finally {
    if (spinner) spinner.style.display = "none"; // مخفی کردن لودینگ
  }
});
