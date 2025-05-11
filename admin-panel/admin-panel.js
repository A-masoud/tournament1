const users = JSON.parse(localStorage.getItem("UserDataList"))||[];

const NumberMember = users.length;

console.log(NumberMember)

document.getElementById("UserCount").textContent = NumberMember;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const DateTime = luxon.DateTime;
        const Duration = luxon.Duration;
        let targetDateTime;

        document.getElementById("timerForm").addEventListener("submit", function(event) {
            event.preventDefault();

            const days = parseInt(document.getElementById("days").value);
            const hours = parseInt(document.getElementById("hours").value);
            const minutes = parseInt(document.getElementById("minutes").value);

            targetDateTime = DateTime.now()
                .plus({ days, hours, minutes })
                .startOf("second");
        });

        function updateTimer() {
            if (!targetDateTime) return;

            const now = DateTime.now();
            const diff = targetDateTime.diff(now, ["days", "hours", "minutes", "seconds"]);

            if (diff.toMillis() <= 0) {
                document.getElementById("timer").innerText = "⏰ زمان تمام شد!";
                return;
            }

            const { days, hours, minutes, seconds } = diff.toObject();
            document.getElementById("timer-tournament").innerText =
                `${Math.floor(days)} روز ${Math.floor(hours)} ساعت ${Math.floor(minutes)} دقیقه ${Math.floor(seconds)} ثانیه`;
        }

        setInterval(updateTimer, 1000);