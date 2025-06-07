import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

/* ---------- انتخاب المنت‌ها ---------- */
const emailCard     = document.getElementById("card-email");
const nameCard      = document.getElementById("card-FullName");
const userNameCard  = document.getElementById("card-UserName");
const editBtn       = document.getElementById("edit-btn");

let isEditing = false;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  localStorage.setItem("currentUserUID", user.uid);
  emailCard.textContent = `ایمیل: ${user.email}`;

  const docRef  = doc(db, "UserDataList", user.uid);
  const docSnap = await getDoc(docRef);
  const userData = docSnap.exists() ? docSnap.data() : { username: "", fullName: "" };

  const renderViewMode = () => {
    nameCard.textContent     = `نام: ${user.displayName || userData.fullName || "(نام تنظیم نشده)"}`;
    userNameCard.textContent = `نام کاربری: ${userData.username || "(ثبت نشده)"}`;
    editBtn.textContent      = "ویرایش اطلاعات";
    isEditing = false;
  };

  const renderEditMode = () => {
    nameCard.innerHTML = `نام: <input id="edit-name" value="${user.displayName || userData.fullName || ""}" />`;
    userNameCard.innerHTML = `نام کاربری: <input id="edit-username" value="${userData.username || ""}" />`;
    editBtn.textContent = "ذخیره تغییرات";
    isEditing = true;
  };

  const validateInputs = (name, username) => {
    const errors = [];

    if (!name) errors.push("نام نباید خالی باشد.");
    if (!username) errors.push("نام کاربری نباید خالی باشد.");
    if (username && username.length < 4)
      errors.push("نام کاربری باید حداقل ۴ کاراکتر باشد.");
    if (username && !/^[a-zA-Z0-9_]+$/.test(username))
      errors.push("نام کاربری فقط می‌تواند شامل حروف، اعداد و آندرلاین (_) باشد.");

    return errors;
  };

  const isUsernameDuplicate = async (username) => {
    const usersRef = collection(db, "UserDataList");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      if (doc.id !== user.uid) {
        return true; // یکی دیگه از این username استفاده کرده
      }
    }
    return false;
  };

  editBtn.addEventListener("click", async () => {
    if (!isEditing) {
      renderEditMode();
    } else {
      const newName     = document.getElementById("edit-name")?.value.trim();
      const newUsername = document.getElementById("edit-username")?.value.trim();

      const errors = validateInputs(newName, newUsername);
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      if (newUsername !== userData.username) {
        const isDuplicate = await isUsernameDuplicate(newUsername);
        if (isDuplicate) {
          alert("این نام کاربری قبلاً استفاده شده است.");
          return;
        }
      }

      try {
        // آپدیت نام در Auth
        if (newName !== user.displayName) {
          await updateProfile(user, { displayName: newName });
        }

        // آپدیت یا ساخت داکیومنت در Firestore
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            username: newUsername,
            fullName: newName
          });
          userData.username = newUsername;
          userData.fullName = newName;
        } else {
          const updateData = {};
          if (newUsername !== userData.username) {
            updateData.username = newUsername;
            userData.username = newUsername;
          }
          if (newName !== userData.fullName) {
            updateData.fullName = newName;
            userData.fullName = newName;
          }
          if (Object.keys(updateData).length > 0) {
            await updateDoc(docRef, updateData);
          }
        }

        renderViewMode();
      } catch (err) {
        console.error("خطا در ذخیره:", err);
        alert("مشکلی در ذخیره اطلاعات به‌وجود آمد.");
      }
    }
  });

  renderViewMode();
});
