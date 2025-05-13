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

    for (let i = 0; i < 4; i++) {
        const img = document.createElement('img');
        img.src = "../img/1.PNG";
        img.alt = "Avatar";
        row.appendChild(img);
    }

    wrapper.appendChild(title);
    wrapper.appendChild(row);

   //////////////////////////////////////////////////////////////////////////////// /// هندل انتخاب تیم
    wrapper.addEventListener("click", () => {
        document.querySelectorAll('.team-wrapper').forEach(el => el.classList.remove("selected"));
        wrapper.classList.add("selected");

        const teamSelectionInfo = document.getElementById("team-selection-info");
        const selectedText = document.getElementById("selected-team-text");

        selectedText.textContent = `شما تیم شماره ${teamNumber} را انتخاب کردید.`;
        teamSelectionInfo.classList.add("active");

        document.getElementById("go-to-register").onclick = () => {
            localStorage.setItem("selectedTeamNumber", teamNumber);
            window.location.href = "register.html";
        };

        setTimeout(() => {
            teamSelectionInfo.classList.remove("active");
        }, 5000);
    });

    return wrapper;
}

for (let i = 0; i < 12; i++) {
    const teamNumberRight = i * 2 + 1;
    const teamNumberLeft = i * 2 + 2;

    rightColumn.appendChild(createTeamBlock(teamNumberRight));
    leftColumn.appendChild(createTeamBlock(teamNumberLeft));
}

// مثال تستی که یه آواتار خاص رو بردر قرمز بدیم
const avatar10 = document.querySelectorAll('.avatar-row img')[9];
avatar10.style.border = "2px solid red";
