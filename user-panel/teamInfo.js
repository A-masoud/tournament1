// === ایمپورت Firebase ===
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const teamsSection = document.getElementById("teams");
const yourTeamCard = document.getElementById("card-YourTeam");
const semiMemberCard = document.getElementById("SemiMember");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    teamsSection.innerHTML = "<p>برای مشاهده تیم خود ابتدا وارد شوید.</p>";
    return;
  }

  const uid = user.uid;
  const userRef = doc(db, "UserDataList", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    teamsSection.innerHTML = "<p>اطلاعات تیمی یافت نشد.</p>";
    return;
  }

  const userData = docSnap.data();
  const teamData = userData.teamRegistered;

  if (!teamData) {
    teamsSection.innerHTML = "<p style = color:white>شما هنوز در تیمی ثبت‌نام نکرده‌اید.</p>";
    
    return;
  }

  // === ساخت محتوای نمایشی تیم ===
  const { teamNumber, leader, players, playerIDs } = teamData;

  yourTeamCard.innerHTML = `✅ شما عضو تیم شماره «${teamNumber}» هستید.`;
  semiMemberCard.innerHTML = `👑 لیدر تیم: ${leader}`;

  // پاک‌کردن آیتم‌های قدیمی اگر وجود داشته باشن
  document.querySelectorAll(".player-info").forEach(e => e.remove());

  // نمایش اعضای تیم با آیدی
  players.forEach((player, index) => {
    const id = playerIDs[index];
    const div = document.createElement("div");
    div.className = "card player-info";
    div.textContent = `🎮 ${player} — آیدی: ${id}`;
    teamsSection.appendChild(div);
  });
});
