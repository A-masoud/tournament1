const totalTeams = 24;

function startCountdown() {
  const countdownEl = document.getElementById("countdown");
  const matchStatusEl = document.getElementById("match-status");
  const savedTimeStr = localStorage.getItem("tournamentStartTime");

  if (!savedTimeStr) {
    countdownEl.textContent = "⏱️ زمان شروع مسابقه هنوز تنظیم نشده.";
    matchStatusEl.textContent = "نامشخص";
    return;
  }

  const tournamentStart = new Date(savedTimeStr);

  function updateCountdown() {
    const now = new Date();
    const diff = tournamentStart - now;

    if (diff <= 0) {
      countdownEl.textContent = "🏁 مسابقه شروع شده!";
      matchStatusEl.textContent = "در حال اجرا یا پایان یافته 🏁";
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.style.direction = "rtl";
    countdownEl.innerHTML = `⏳ زمان باقی مانده تا مسابقه:<br><hr>${days} روز، ${hours} ساعت، ${minutes} دقیقه، ${seconds} ثانیه`;
    matchStatusEl.textContent = "در انتظار شروع ⏳";
  }

  updateCountdown(); // اجرای اولیه
  const intervalId = setInterval(updateCountdown, 1000);
}

function updateTeamCounts() {
  const registeredTeamsElement = document.getElementById("registered-teams");
  const emptySlotsElement = document.getElementById("empty-slots");

  let registeredCount = 0;

  for (let i = 1; i <= totalTeams; i++) {
    if (localStorage.getItem(`team-${i}`)) {
      registeredCount++;
    }
  }

  const emptySlots = totalTeams - registeredCount;

  registeredTeamsElement.textContent = `${registeredCount} تیم ثبت‌نام شده`;
  emptySlotsElement.textContent = `${emptySlots} جایگاه خالی`;
}

// اجرای اولیه
startCountdown();
updateTeamCounts();

// آپدیت تعداد تیم‌ها هر ۵ ثانیه
setInterval(updateTeamCounts, 5000);
