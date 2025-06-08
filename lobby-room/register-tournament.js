// === ایمپورت Firebase ===
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();
const auth = getAuth();

const teamNumber = localStorage.getItem("selectedTeamNumber");
const welcomeMessage = document.getElementById("welcome-message");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("برای ثبت‌نام ابتدا باید وارد حساب خود شوید.");
    window.location.href = "../login-signup/register.html";
    return;
  }

  const uid = user.uid;
  localStorage.setItem("currentUserUID", uid);

  let username = "کاربر";
  try {
    const docRef = doc(db, "UserDataList", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      username = userData.username || "کاربر";
      localStorage.setItem("currentUsername", username);

      // اگر قبلاً تیم ثبت‌نام کرده بود
      if (userData.teamRegistered) {
        const prevTeam = userData.teamRegistered;
        const confirmUse = confirm(`شما قبلاً تیم شماره ${prevTeam.teamNumber} رو ثبت‌نام کردید.\nآیا می‌خواید اطلاعات قبلی‌تون برای فرم فعلی استفاده بشه؟`);
        if (confirmUse) {
          document.querySelector('input[name="leaderName"]').value = prevTeam.leader || "";

          const playerUsernames = [
            'player1Username',
            'player2Username',
            'player3Username',
            'player4Username'
          ];
          const playerIDs = [
            'player1ID',
            'player2ID',
            'player3ID',
            'player4ID'
          ];

          playerUsernames.forEach((name, i) => {
            document.querySelector(`input[name="${name}"]`).value = prevTeam.players[i] || "";
          });

          playerIDs.forEach((id, i) => {
            document.querySelector(`input[name="${id}"]`).value = prevTeam.playerIDs[i] || "";
          });
        }
      }
    }
  } catch (error) {
    console.error("خطا در دریافت یوزرنیم از Firestore:", error);
  }

  if (teamNumber) {
    welcomeMessage.innerHTML = `🌟 سلام <strong>${username}</strong>!<br>شما تیم شماره <strong>${teamNumber}</strong> رو انتخاب کردید.<br>حالا نوبت ثبت‌نامه!`;
  } else {
    welcomeMessage.textContent = "لطفاً ابتدا تیم خود را انتخاب کنید.";
  }

  welcomeMessage.classList.add('active');
  document.querySelectorAll('.leader, .player-group, .hr-user, h3, .between').forEach(el => el.classList.add('active'));

  function validatePlayerID(inputElement, errorElementID) {
    const value = inputElement.value.trim();
    const errorElement = document.getElementById(errorElementID);

    if (!/^\d{8,12}$/.test(value)) {
      errorElement.style.display = "block";
      inputElement.classList.add("invalid");
      return false;
    } else {
      errorElement.style.display = "none";
      inputElement.classList.remove("invalid");
      return true;
    }
  }

  const playerIDInputs = [
    { input: document.querySelector('input[name="player1ID"]'), error: 'player1ID-error' },
    { input: document.querySelector('input[name="player2ID"]'), error: 'player2ID-error' },
    { input: document.querySelector('input[name="player3ID"]'), error: 'player3ID-error' },
    { input: document.querySelector('input[name="player4ID"]'), error: 'player4ID-error' }
  ];

  playerIDInputs.forEach(({ input, error }) => {
    if (input) {
      input.addEventListener('input', () => validatePlayerID(input, error));
    }
  });

  async function isTeamTaken(teamNumber) {
    const docRef = doc(db, "teams", `team-${teamNumber}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!teamNumber) {
      alert("لطفاً ابتدا یک تیم انتخاب کنید.");
      return;
    }

    const leaderName = this.leaderName.value.trim();
    const players = [
      this.player1Username.value.trim(),
      this.player2Username.value.trim(),
      this.player3Username.value.trim(),
      this.player4Username.value.trim()
    ];
    const playerIDs = playerIDInputs.map(({ input }) => input.value.trim());

    if (!leaderName || players.some(p => !p) || playerIDs.some(id => !id)) {
      alert("لطفاً تمام فیلدها را به‌طور کامل پر کنید.");
      return;
    }

    const uniquePlayers = new Set(players);
    if (uniquePlayers.size !== players.length) {
      alert("نام‌های کاربری نباید تکراری باشند.");
      return;
    }

    const uniquePlayerIDs = new Set(playerIDs);
    if (uniquePlayerIDs.size !== playerIDs.length) {
      alert("آیدی‌های بازیکنان نباید تکراری باشند.");
      return;
    }

    const areIDsValid = playerIDInputs.every(({ input, error }) => validatePlayerID(input, error));
    if (!areIDsValid) {
      alert("لطفاً تمام آیدی‌های بازیکنان را به‌درستی (بین ۸ تا ۱۲ رقم) وارد کنید.");
      return;
    }

    const teamExistsInFirebase = await isTeamTaken(teamNumber);
    if (teamExistsInFirebase) {
      alert("این تیم قبلاً رزرو شده است!");
      return;
    }

    const teamData = {
      leader: leaderName,
      players: players,
      playerIDs: playerIDs,
      locked: true,
      registeredBy: uid
    };

    localStorage.setItem(`team-${teamNumber}`, JSON.stringify(teamData));

    await setDoc(doc(db, "teams", `team-${teamNumber}`), teamData);

    const userRef = doc(db, "UserDataList", uid);
    await setDoc(userRef, {
      teamRegistered: {
        teamNumber: teamNumber,
        leader: leaderName,
        players: players,
        playerIDs: playerIDs
      }
    }, { merge: true });

    const messagePanel = document.createElement('div');
    messagePanel.style.position = 'fixed';
    messagePanel.style.top = '50%';
    messagePanel.style.left = '50%';
    messagePanel.style.transform = 'translate(-50%, -50%)';
    messagePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    messagePanel.style.color = 'white';
    messagePanel.style.padding = '20px 30px';
    messagePanel.style.borderRadius = '10px';
    messagePanel.style.textAlign = 'center';
    messagePanel.style.fontSize = '18px';
    messagePanel.style.zIndex = '10000';
    messagePanel.style.fontFamily = "'Bebas Neue', sans-serif";

    let countdown = 5;
    messagePanel.innerHTML = `
      ✅ پرداخت با موفقیت شبیه‌سازی شد!<br>
      شما در حال انتقال به لابی هستید...<br>
      لطفاً صبر کنید <span id="countdown">${countdown}</span> ثانیه.
    `;

    document.body.appendChild(messagePanel);

    const countdownElement = document.getElementById('countdown');
    const interval = setInterval(() => {
      countdown--;
      countdownElement.textContent = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        document.body.removeChild(messagePanel);
        window.location.href = "lobby-room.html";
      }
    }, 1000);
  });
});
