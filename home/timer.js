function startCountdown() {
  const countdownEl = document.getElementById('countdown');
  const savedTimeStr = localStorage.getItem('tournamentStartTime');

  if (!savedTimeStr) {
    countdownEl.textContent = '⏱️ زمان شروع مسابقه هنوز تنظیم نشده.';
    return;
  }

  const tournamentStart = new Date(savedTimeStr);

  function update() {
    const now = new Date();
    const diff = tournamentStart - now;

    if (diff <= 0) {
      countdownEl.textContent = '🏁 مسابقه شروع شده!';
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.style.direction = 'rtl';

    countdownEl.innerHTML =
  `⏳ زمان باقی مانده تا مسابقه:<br><hr>${days} روز، ${hours} ساعت، ${minutes} دقیقه، ${seconds} ثانیه`;
  }

  update(); // اجرای اول
  const intervalId = setInterval(update, 1000);
}

// وقتی فایل لود شد، تایمر رو استارت کن
startCountdown();

const totalTeams = 24;

const registeredTeamsElement = document.getElementById("registered-teams");
const emptySlotsElement = document.getElementById("empty-slots");


function updateTeamCounts() {
  let registeredCount = 0;

  for (let i = 1; i <= totalTeams; i++) {
    const teamData = localStorage.getItem(`team-${i}`);
    if (teamData) {
      registeredCount++;
    }
  }

  const emptySlots = totalTeams - registeredCount;

  registeredTeamsElement.textContent = `${registeredCount} تیم ثبت‌نام شده`;
  emptySlotsElement.textContent = `${emptySlots} جایگاه خالی`;
}

updateTeamCounts();

// هر ۵ ثانیه آپدیت کن
setInterval(updateTeamCounts, 5000);
