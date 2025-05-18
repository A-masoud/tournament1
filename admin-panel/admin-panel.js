const users = JSON.parse(localStorage.getItem("UserDataList")) || [];
const NumberMember = users.length;
document.getElementById("UserCount").textContent = NumberMember;

document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const contentSection = document.querySelector(".content");

  sidebarLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // لینک فعال رو مشخص کن
      sidebarLinks.forEach(item => item.classList.remove("active-link"));
      this.classList.add("active-link");

      const section = this.dataset.section;

      // بارگذاری محتوای سکشن از فایل HTML
      fetch(`sections/${section}.html`)
        .then(res => res.text())
        .then(data => {
          contentSection.innerHTML = data;

          // حالا بذار DOM کامل بشه، بعد تابع رو صدا بزن
          setTimeout(() => {
            if (section === "users-list") {
              renderTable();
            }

            if (section === "event") {
              setupEventSteps(); // اینجا حالا مطمئنیم دکمه‌ها تو DOM هستن
            }
          });
        })
        .catch(err => {
          contentSection.innerHTML = `<p style="color:red;">خطا در بارگذاری محتوا</p>`;
          console.error(err);
        });
    });
  });
});



let UserDataList = JSON.parse(localStorage.getItem("UserDataList")) || [];


function renderTable() {
  const tableBody = document.getElementById("table-body");
  if (tableBody) {
    if (UserDataList.length > 0) {
      let rows = "";
      UserDataList.forEach((user, index) => {
        rows += `
          <tr>
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td><button onclick="deleteUser(${index})">حذف</button></td>
          </tr>
        `;
      });
      tableBody.innerHTML = rows;
    } else {
      tableBody.innerHTML = '<tr><td colspan="5">هیچ کاربری یافت نشد</td></tr>';
    }
  }
}


function deleteUser(index) {
  if (confirm("آیا مطمئنی که می‌خوای این کاربر حذف بشه؟")) {
    UserDataList.splice(index, 1);
    localStorage.setItem("UserDataList", JSON.stringify(UserDataList));
    renderTable();
  }
}


function clearUsers() {
  if (confirm("آیا مطمئنی که می‌خوای همه کاربران حذف بشن؟")) {
    localStorage.removeItem("UserDataList");
    UserDataList = [];
    renderTable();
    alert("همه کاربران حذف شدند ✅");
  }
}
////////////////////////////////////////////////////////////////////////////
function setStartTime() {
  const dateValue = document.getElementById("startDate").value;
  const timeValue = document.getElementById("startClock").value;

  if (!dateValue || !timeValue) {
    alert("لطفاً تاریخ و ساعت رو کامل وارد کن.");
    return;
  }


  const fullDateTime = new Date(`${dateValue}T${timeValue}`);

  
  localStorage.setItem("tournamentStartTime", fullDateTime.toISOString());

  document.getElementById("currentTime").textContent =
    "زمان تنظیم‌شده: " + fullDateTime.toLocaleString("fa-IR");

  alert("⏳ زمان شروع مسابقه با موفقیت ذخیره شد!");
}


const savedTime = localStorage.getItem("tournamentStartTime");
if (savedTime) {
  const date = new Date(savedTime);
  document.getElementById("currentTime").textContent =
    "زمان فعلی ذخیره‌شده: " + date.toLocaleString("fa-IR");
}

////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const users = JSON.parse(localStorage.getItem("UserDataList")) || [];
  const NumberMember = users.length;
  const userCountEl = document.getElementById("UserCount");
  if (userCountEl) {
    userCountEl.textContent = NumberMember;
  }

  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const contentSection = document.querySelector(".content");

  sidebarLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      sidebarLinks.forEach(item => item.classList.remove("active-link"));
      this.classList.add("active-link");

      const section = this.dataset.section;

      fetch(`sections/${section}.html`)
        .then(res => res.text())
        .then(data => {
          contentSection.innerHTML = data;

          if (section === "users-list") {
            renderTable();
          }

          if (section === "event") {
            setupEventSteps(); // ✅ بعد از لود رویداد، اسکریپت مراحل اجرا می‌شه
          }
        })
        .catch(err => {
          contentSection.innerHTML = `<p style="color:red;">خطا در بارگذاری محتوا</p>`;
          console.error(err);
        });
    });
  });
});

function setupEventSteps() {
  console.log("setupEventSteps called");

  const step1Next = document.getElementById("step1-next");
  const step2Next = document.getElementById("step2-next");
  const saveEvent = document.getElementById("save-event");

  let eventData = {}; // ✅ اول تعریف می‌شه

  if (step1Next) {
    step1Next.addEventListener("click", () => {
      const startTime = document.getElementById("event-start-time").value;
      if (!startTime) {
        alert("⏰ لطفا زمان شروع رو وارد کن");
        return;
      }

      eventData.start = startTime;

      document.getElementById("step-1").style.display = "none";
      document.getElementById("step-2").style.display = "block";
    });
  }

  if (step2Next) {
    step2Next.addEventListener("click", () => {
      const selectedMap = document.getElementById("event-map").value;
      eventData.map = selectedMap;

      document.getElementById("confirm-start").textContent = eventData.start;
      document.getElementById("confirm-map").textContent = eventData.map;

      document.getElementById("step-2").style.display = "none";
      document.getElementById("step-3").style.display = "block";
    });
  }

  if (saveEvent) {
    saveEvent.addEventListener("click", () => {
      let events = JSON.parse(localStorage.getItem("EventHistory")) || [];
      events.push(eventData);
      localStorage.setItem("EventHistory", JSON.stringify(events));

      alert("✅ رویداد ثبت شد");

      renderEventHistory();
    });
  }

  renderEventHistory(); // ✅ نمایش لیست قبلی
}

function renderEventHistory() {
  const history = JSON.parse(localStorage.getItem("EventHistory")) || [];
  const list = document.getElementById("event-history");

  if (!list) return;

  list.innerHTML = "";

  if (history.length === 0) {
    list.innerHTML = "<li>هیچ رویدادی ثبت نشده است.</li>";
    return;
  }

  history.forEach((event, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} - ⏰ ${event.start} | 🗺️ ${event.map}`;
    list.appendChild(li);
  });
}

