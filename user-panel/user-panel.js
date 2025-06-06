import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    localStorage.setItem("currentUserUID", user.uid);

    // نمایش ایمیل
    const emailCard = document.getElementById("card-email");
    emailCard.textContent = `ایمیل: ${user.email}`;

    // نمایش نام کامل (displayName)
    const nameCard = document.getElementById("card-FullName");
    nameCard.textContent = `نام: ${user.displayName || "(نام تنظیم نشده)"}`;

    // گرفتن username از Firestore
    const docRef = doc(db, "UserDataList", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const userNameCard = document.getElementById("card-UserName");
      userNameCard.textContent = `نام کاربری: ${userData.username}`;
    }
  }
});