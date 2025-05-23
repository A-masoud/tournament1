import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// --- تنظیمات Firebase خودت رو اینجا بذار ---
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

async function getTeamData(teamNumber) {
  const docRef = doc(db, "teams", `team-${teamNumber}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();  // داده تیم، شامل آرایه players
  } else {
    return null; // تیم خالی (رزرو نشده)
  }
}

async function createTeamBlock(teamNumber) {
  const wrapper = document.createElement('div');
  wrapper.classList.add("team-wrapper", "hover-effect");

  const title = document.createElement('p');
  title.textContent = `Team ${teamNumber}`;
  title.style.margin = "0 0 5px 0";
  title.style.fontWeight = "bold";
  title.style.textAlign = "center";
  title.style.color = "#f0f0f0";
  title.style.fontFamily = "'Bebas Neue', sans-serif";
  title.style.backgroundColor = "rgba(255, 255, 255, 0.377)";
  title.style.borderRadius = "50px";

  const row = document.createElement('div');
  row.className = 'avatar-row';

  // داده‌ها رو از Firebase بخون
  const teamData = await getTeamData(teamNumber);
  const isLocked = !!teamData;
  let playerNames = [];

  if (isLocked) {
    playerNames = teamData.players || [];
  }

  for (let i = 0; i < 4; i++) {
      const container = document.createElement('div');
      container.style.position = "relative";
      container.style.display = "inline-block";

      const img = document.createElement('img');
      img.src = "../img/1.PNG"; // مسیر عکس آواتار
      img.alt = "Avatar";

      const nameOverlay = document.createElement('span');
      nameOverlay.textContent = playerNames[i] || "";
      nameOverlay.style.position = "absolute";
      nameOverlay.style.bottom = "4px";
      nameOverlay.style.left = "50%";
      nameOverlay.style.transform = "translateX(-50%)";
      nameOverlay.style.fontSize = "10px";
      nameOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      nameOverlay.style.color = "white";
      nameOverlay.style.padding = "0px 4px";
      nameOverlay.style.borderRadius = "4px";
      nameOverlay.style.pointerEvents = "none";
      nameOverlay.style.whiteSpace = "nowrap";

      container.appendChild(img);
      container.appendChild(nameOverlay);
      row.appendChild(container);
  }

  wrapper.appendChild(title);
  wrapper.appendChild(row);

  if (isLocked) {
      wrapper.classList.add("locked");
      if (!wrapper.querySelector('.reserved-stamp')) {
          const stamp = document.createElement('div');
          stamp.classList.add('reserved-stamp');
          stamp.textContent = 'رزرو شد';
          wrapper.style.position = 'relative';
          wrapper.appendChild(stamp);
        }
      wrapper.style.opacity = "0.5";
      wrapper.style.cursor = "not-allowed";

      wrapper.addEventListener("mouseenter", () => {
          wrapper.style.opacity = "1";
          wrapper.style.border = "2px solid red";
          wrapper.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      });

      wrapper.addEventListener("mouseleave", () => {
          wrapper.style.opacity = "0.5";
          wrapper.style.border = "none";
          wrapper.style.backgroundColor = "transparent";
      });

      wrapper.addEventListener("click", () => {
          alert("❌ این تیم قبلاً رزرو شده است.");
      });
  } else {
      wrapper.addEventListener("click", () => {
          document.querySelectorAll('.team-wrapper').forEach(el => el.classList.remove("selected"));
          wrapper.classList.add("selected");

          const teamSelectionInfo = document.getElementById("team-selection-info");
          const selectedText = document.getElementById("selected-team-text");

          selectedText.textContent = `شما تیم شماره ${teamNumber} را انتخاب کردید.`;
          teamSelectionInfo.classList.add("active");

          document.getElementById("go-to-register").onclick = () => {
              localStorage.setItem("selectedTeamNumber", teamNumber);
              window.location.href = "register-tournament.html";
          };

          setTimeout(() => {
              teamSelectionInfo.classList.remove("active");
          }, 5000);
      });
  }

  return wrapper;
}

async function renderTeams() {
  const leftColumn = document.querySelectorAll('.column')[0];
  const rightColumn = document.querySelectorAll('.column')[1];

  for (let i = 0; i < 12; i++) {
      const teamNumberRight = i * 2 + 1;
      const teamNumberLeft = i * 2 + 2;

      const rightBlock = await createTeamBlock(teamNumberRight);
      rightColumn.appendChild(rightBlock);

      const leftBlock = await createTeamBlock(teamNumberLeft);
      leftColumn.appendChild(leftBlock);
  }
}

renderTeams();

async function countAvailableTeams(totalTeams) {
  let count = 0;
  for (let teamNumber = 1; teamNumber <= totalTeams; teamNumber++) {
      const docRef = doc(db, "teams", `team-${teamNumber}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
          count++;
      }
  }
  return count;
}

async function updateTeamsCountInFirestore() {
  const totalTeams = 24;
  const availableCount = await countAvailableTeams(totalTeams);
  const registeredCount = totalTeams - availableCount;

  const statsDocRef = doc(db, "teamStats", "counts");

  await setDoc(statsDocRef, {
    totalTeams,
    availableTeams: availableCount,
    registeredTeams: registeredCount,
    updatedAt: new Date()
  });

  console.log("تعداد تیم‌ها در فایربیس به‌روزرسانی شد:", {availableCount, registeredCount});
}

// بار اول
updateTeamsCountInFirestore();

// هر ۵ ثانیه یکبار
setInterval(updateTeamsCountInFirestore, 5000);
