import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5mI93Gj8Oo73OLFMdoRExN46Ffcr1AQ4",
  authDomain: "tournify-app.firebaseapp.com",
  projectId: "tournify-app",
  storageBucket: "tournify-app.appspot.com",
  messagingSenderId: "273027702239",
  appId: "1:273027702239:web:ae13272cba831cca2ef86a",
  measurementId: "G-GEKS6X6RCV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const leftColumn = document.querySelectorAll('.column')[0];
const rightColumn = document.querySelectorAll('.column')[1];

let teamDataMap = new Map(); // teamNumber => teamData

function createTeamBlock(teamNumber) {
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

    const savedData = localStorage.getItem(`team-${teamNumber}`);
    const isLocked = !!savedData;
    let playerNames = [];

    if (isLocked) {
      const teamData = JSON.parse(savedData);
      playerNames = teamData.players || [];
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
        // ارسال شماره تیم از طریق query string
        window.location.href = `register-tournament.html?team=${teamNumber}`;
      };

      setTimeout(() => {
        teamSelectionInfo.classList.remove("active");
      }, 5000);
    });
  }

  return wrapper;
}

// دریافت تیم‌ها از فایربیس و ساخت DOM
async function renderTeams() {
  leftColumn.innerHTML = '';
  rightColumn.innerHTML = '';

  const snapshot = await getDocs(collection(db, "Teams"));
  teamDataMap.clear();

  snapshot.forEach(doc => {
    const data = doc.data();
    teamDataMap.set(data.teamNumber, data);
  });

  for (let i = 0; i < 12; i++) {
    const teamNumberRight = i * 2 + 1;
    const teamNumberLeft = i * 2 + 2;

    rightColumn.appendChild(createTeamBlock(teamNumberRight));
    leftColumn.appendChild(createTeamBlock(teamNumberLeft));
  }

  updateAvailableTeams();
}

function updateAvailableTeams() {
  let count = 0;
  for (let i = 1; i <= 24; i++) {
    const team = teamDataMap.get(i);
    if (!team || !team.players || team.players.length === 0) {
      count++;
    }
  }
  console.log("✅ تعداد تیم‌های خالی از Firebase:", count);
}

// اجرای اولیه
renderTeams();
