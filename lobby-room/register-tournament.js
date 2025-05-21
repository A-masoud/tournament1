const teamNumber = localStorage.getItem("selectedTeamNumber");
const welcomeMessage = document.getElementById("welcome-message");

if (teamNumber) {
    welcomeMessage.innerHTML = `🌟 خوش اومدی <strong>لیدر</strong>!<br>شما وارد ثبت‌نام شدید و <strong>تیم شماره ${teamNumber}</strong> رو انتخاب کردی.<br>با آرزوی بهترین‌ها در مسیر رقابت!`;
} else {
    welcomeMessage.textContent = "لطفاً ابتدا تیم خود را انتخاب کنید.";
}

welcomeMessage.classList.add('active');

document.querySelectorAll('.leader, .player-group ,.hr-user , h3,.between').forEach(element => {
    element.classList.add('active');
});


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

// انتخاب فیلدهای آیدی
const playerIDInputs = [
    { input: document.querySelector('input[name="player1ID"]'), error: 'player1ID-error' },
    { input: document.querySelector('input[name="player2ID"]'), error: 'player2ID-error' },
    { input: document.querySelector('input[name="player3ID"]'), error: 'player3ID-error' },
    { input: document.querySelector('input[name="player4ID"]'), error: 'player4ID-error' }
];

// بررسی وجود تمام فیلدهای آیدی
if (playerIDInputs.some(({ input }) => !input)) {
    console.error("یکی از فیلدهای آیدی یافت نشد. لطفاً HTML را بررسی کنید.");
}

// اعتبارسنجی در زمان تایپ
playerIDInputs.forEach(({ input, error }) => {
    if (input) {
        input.addEventListener('input', () => validatePlayerID(input, error));
    }
});

// مدیریت ارسال فرم
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
    const playerIDs = playerIDInputs.map(({ input }) => input.value.trim());

    if (!leaderName || players.some(p => !p) || playerIDs.some(id => !id)) {
        alert("لطفاً تمام فیلدها را به‌طور کامل پر کنید.");
        return;
    }

    console.log("نام‌های کاربری:", players);
    console.log("آیدی‌ها:", playerIDs);

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

    const existingTeam = localStorage.getItem(`team-${teamNumber}`);
    if (existingTeam) {
        alert("این تیم قبلاً رزرو شده است!");
        return;
    }

    // ذخیره تیم
    const teamData = {
        leader: leaderName,
        players: players,
        playerIDs: playerIDs,
        locked: true
    };
    localStorage.setItem(`team-${teamNumber}`, JSON.stringify(teamData));

    // نمایش پیام موفقیت
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
    if (!countdownElement) {
        console.error("عنصر countdown یافت نشد.");
    }
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
