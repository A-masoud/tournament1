import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();
const teamsCollectionRef = collection(db, "teams");

let cachedTeamsData = null;

async function fetchAllTeamsData() {
  if (cachedTeamsData) return cachedTeamsData; // اگر قبلاً کش شده بود برگردان
  const querySnapshot = await getDocs(teamsCollectionRef);
  const data = {};
  querySnapshot.forEach(docSnap => {
    data[docSnap.id] = docSnap.data();
  });
  cachedTeamsData = data;
  return data;
}

function getTeamDataFromCache(teamNumber) {
  if (!cachedTeamsData) return null;
  return cachedTeamsData[`team-${teamNumber}`] || null;
}

function createTeamBlock(teamNumber) {
  const wrapper = document.createElement('div');
  wrapper.classList.add("team-wrapper", "hover-effect");

  const title = document.createElement('p');
  title.textContent = `Team ${teamNumber}`;
  title.style.margin = "0 0 5px 0";
  title.style.fontWeight = "bold";
  title.style.textAlign = "center";
  title.style.fontFamily = "'Bebas Neue', sans-serif";
  title.style.backgroundColor = "rgba(255, 255, 255, 0.377)";
  title.style.borderRadius = "100px";
  title.style.fontSize ="23px"
  title.style.letterSpacing = "2px"
  title.style.color = "rgb(186, 255, 210)"

  const row = document.createElement('div');
  row.className = 'avatar-row';

  // داده تیم رو از کش می‌گیریم (بدون async)
  const teamData = getTeamDataFromCache(teamNumber);
  const isLocked = !!teamData;
  let playerNames = isLocked ? teamData.players || [] : [];

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
      title.style.color = "red"
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
      const teamSelectionInfo = document.getElementById("team-selection-info");
      const selectedText = document.getElementById("selected-team-text");
      const goToRegisterButton = document.getElementById("go-to-register");

      selectedText.textContent = `❌ این تیم قبلاً رزرو شده است.`;
      goToRegisterButton.textContent = "باشه";
      teamSelectionInfo.classList.add("active");

      goToRegisterButton.onclick = () => {
        teamSelectionInfo.classList.remove("active");
        goToRegisterButton.textContent = "ادامه و ثبت‌نام";
      };
    });
  } else {
    wrapper.addEventListener("click", () => {
      document.querySelectorAll('.team-wrapper').forEach(el => el.classList.remove("selected"));
      wrapper.classList.add("selected");

      const teamSelectionInfo = document.getElementById("team-selection-info");
      const selectedText = document.getElementById("selected-team-text");
      const goToRegisterButton = document.getElementById("go-to-register");

      selectedText.textContent = `شما تیم شماره ${teamNumber} را انتخاب کردید.`;
      goToRegisterButton.textContent = "ادامه و ثبت‌نام";
      teamSelectionInfo.classList.add("active");

      goToRegisterButton.onclick = () => {
        localStorage.setItem("selectedTeamNumber", teamNumber);
        window.location.href = "register-tournament.html";
      };

      setTimeout(() => {
        teamSelectionInfo.classList.remove("active");
        goToRegisterButton.textContent = "ادامه و ثبت‌نام";
      }, 5000);
    });
  }

  return wrapper;
}

async function renderTeams() {
  const leftColumn = document.querySelectorAll('.column')[0];
  const rightColumn = document.querySelectorAll('.column')[1];

  await fetchAllTeamsData(); // اول داده‌ها را کش کن

  for (let i = 0; i < 12; i++) {
    const teamNumberRight = i * 2 + 1;
    const teamNumberLeft = i * 2 + 2;

    const rightBlock = createTeamBlock(teamNumberRight);
    rightColumn.appendChild(rightBlock);

    const leftBlock = createTeamBlock(teamNumberLeft);
    leftColumn.appendChild(leftBlock);
  }
}

renderTeams();

// به‌روزرسانی تعداد تیم‌ها (مثل قبل، با کش)
let lastStats = { availableTeams: null, registeredTeams: null };

async function updateTeamsCountInFirestore() {
  const totalTeams = 24;
  await fetchAllTeamsData();

  let availableCount = 0;
  for (let i = 1; i <= totalTeams; i++) {
    if (!cachedTeamsData[`team-${i}`]) availableCount++;
  }
  const registeredCount = totalTeams - availableCount;

  if (availableCount !== lastStats.availableTeams || registeredCount !== lastStats.registeredTeams) {
    const statsDocRef = doc(db, "teamStats", "counts");

    await setDoc(statsDocRef, {
      totalTeams,
      availableTeams: availableCount,
      registeredTeams: registeredCount,
      updatedAt: new Date()
    });

    console.log("تعداد تیم‌ها در فایربیس به‌روزرسانی شد:", { availableCount, registeredCount });
    lastStats = { availableTeams: availableCount, registeredTeams: registeredCount };
  }
}

updateTeamsCountInFirestore();
setInterval(updateTeamsCountInFirestore, 5000);
