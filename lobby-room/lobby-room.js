const leftColumn = document.querySelectorAll('.column')[0];
const rightColumn = document.querySelectorAll('.column')[1];

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

    // داده‌های تیم از لوکال‌استوریج بخون
    const savedData = localStorage.getItem(`team-${teamNumber}`);
    const isLocked = !!savedData;
    let playerNames = [];

    if (isLocked) {
      const teamData = JSON.parse(savedData);
      // فقط نام‌های بازیکنان (بازی‌کن‌ها) که داخل آرایه players هستند
      playerNames = teamData.players || [];
    }

    for (let i = 0; i < 4; i++) {
        const container = document.createElement('div');
        container.style.position = "relative";
        container.style.display = "inline-block";

        const img = document.createElement('img');
        img.src = "../img/1.PNG";
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

for (let i = 0; i < 12; i++) {
    const teamNumberRight = i * 2 + 1;
    const teamNumberLeft = i * 2 + 2;

    rightColumn.appendChild(createTeamBlock(teamNumberRight));
    leftColumn.appendChild(createTeamBlock(teamNumberLeft));
}



const totalTeams = 24;

function countAvailableTeams(totalTeams) {
    let count = 0;
    for (let teamNumber = 1; teamNumber <= totalTeams; teamNumber++) {
        const savedData = localStorage.getItem(`team-${teamNumber}`);
        if (!savedData) {
            count++;
        }
    }
    return count;
} 

let availableTeamsCount = countAvailableTeams(totalTeams);
localStorage.setItem("availableTeamsCount", availableTeamsCount);


setInterval(() => {
    const updatedCount = countAvailableTeams(totalTeams);
    localStorage.setItem("availableTeamsCount", updatedCount);
    console.log("تعداد تیم‌های خالی به‌روز شد:", updatedCount);
}, 5000);

