import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

let UserDataList = [];

async function loadUsers() {
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.style.display = "block"; // نمایش لودینگ

  try {
    const querySnapshot = await getDocs(collection(db, "UserDataList"));
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push({ id: doc.id, ...doc.data() });
    });

    // فقط اگه داده‌ها تغییر کردن، جدول رو دوباره رندر کن
    if (JSON.stringify(newData) !== JSON.stringify(UserDataList)) {
      UserDataList = newData;
      renderTable();
    }
  } catch (err) {
    alert("خطا در دریافت اطلاعات: " + err.message);
  } finally {
    if (spinner) spinner.style.display = "none"; // مخفی کردن لودینگ
  }
}

function renderTable() {
  const tableBody = document.getElementById("table-body");
  if (!tableBody) return;

  if (UserDataList.length > 0) {
    let rows = "";
    UserDataList.forEach((user) => {
      rows += `
        <tr>
          <td>${user.username || ""}</td>
          <td>${user.fullName || ""}</td>
          <td>${user.email || ""}</td>
          <td>${user.password || ""}</td>
          <td><button onclick="deleteUser('${user.id}')">حذف</button></td>
        </tr>
      `;
    });
    tableBody.innerHTML = rows;
  } else {
    tableBody.innerHTML = '<tr><td colspan="5">هیچ کاربری یافت نشد</td></tr>';
  }
}

async function deleteUser(id) {
  if (confirm("آیا مطمئنی که می‌خوای این کاربر حذف بشه؟")) {
    try {
      await deleteDoc(doc(db, "users", id));
      alert("کاربر حذف شد ✅");
      await loadUsers();
    } catch (error) {
      alert("خطا در حذف: " + error.message);
    }
  }
}

async function clearUsers() {
  if (confirm("آیا مطمئنی که می‌خوای همه کاربران حذف بشن؟")) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const promises = [];
      querySnapshot.forEach((document) => {
        promises.push(deleteDoc(doc(db, "users", document.id)));
      });
      await Promise.all(promises);
      UserDataList = [];
      renderTable();
      alert("همه کاربران حذف شدند ✅");
    } catch (error) {
      alert("خطا در حذف همه کاربران: " + error.message);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadUsers(); // بارگذاری اولیه
  setInterval(loadUsers, 5000); // هر ۳ ثانیه آپدیت لیست
});

window.deleteUser = deleteUser;
window.clearUsers = clearUsers;
