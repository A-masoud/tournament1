const teamNumber = localStorage.getItem("selectedTeamNumber");
const welcomeMessage = document.getElementById("welcome-message");

if (teamNumber) {
  welcomeMessage.innerHTML = `🌟 خوش اومدی <strong>لیدر</strong>!<br>شما وارد ثبت‌نام شدید و <strong>تیم شماره ${teamNumber}</strong> رو انتخاب کردی.<br>با آرزوی بهترین‌ها در مسیر رقابت!`;
} else {
  welcomeMessage.textContent = "لطفاً ابتدا تیم خود را انتخاب کنید.";
}

document.getElementById("register-form").addEventListener("submit", function (e) {
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

  // اعتبارسنجی خالی بودن فیلدها
  if (!leaderName || players.some(p => !p)) {
    alert("لطفاً تمام فیلدها را به‌طور کامل پر کنید.");
    return;
  }

  // اعتبارسنجی تکراری بودن یوزرنیم‌ها
  const uniquePlayers = new Set(players);
  if (uniquePlayers.size !== players.length) {
    alert("نام‌های کاربری نباید تکراری باشند.");
    return;
  }

  // بررسی اینکه تیم قبلاً رزرو نشده باشه
  const existingTeam = localStorage.getItem(`team-${teamNumber}`);
  if (existingTeam) {
    alert("این تیم قبلاً رزرو شده است!");
    return;
  }

  // ذخیره تیم
  const teamData = {
    leader: leaderName,
    players: players,
    locked: true
  };
  localStorage.setItem(`team-${teamNumber}`, JSON.stringify(teamData));

  // ساخت پنل پیام موفقیت
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

  // شمارش معکوس
  const countdownElement = document.getElementById('countdown');
  const interval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(interval);
      document.body.removeChild(messagePanel);
      window.location.href = "lobby-room.html"; // انتقال به لابی
    }
  }, 1000);
});
