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
function setupEventSteps() {
  const startTimeInput = document.getElementById("event-start-time");
  const now = new Date();
  const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  startTimeInput.min = localISOTime;

  const step1Next = document.getElementById("step1-next");
  const step2Next = document.getElementById("step2-next");
  const saveEvent = document.getElementById("save-event");
  let eventData = {};

  if (step1Next) {
    step1Next.addEventListener("click", () => {
      const startTime = startTimeInput.value;
      if (!startTime) return alert("⏰ لطفا زمان شروع رو وارد کن");
      if (new Date(startTime) < new Date()) return alert("❌ نمی‌تونی تاریخ گذشته انتخاب کنی!");

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

      const isDuplicate = events.some(ev => ev.start === eventData.start && ev.map === eventData.map);
      if (isDuplicate) {
        alert("❗ این رویداد قبلاً ثبت شده");
        return;
      }

      events.push(eventData);
      localStorage.setItem("EventHistory", JSON.stringify(events));
      alert("✅ رویداد ثبت شد");
      renderEventHistory();
    });
  }

  renderEventHistory();
}

function deleteEvent(index) {
  let events = JSON.parse(localStorage.getItem("EventHistory")) || [];
  events.splice(index, 1);
  localStorage.setItem("EventHistory", JSON.stringify(events));
  renderEventHistory();
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

    // بخش کلی رویداد (متن اصلی)
    const mainInfo = document.createElement("div");
    mainInfo.style.cursor = "default"; // کلیک روش کاری نکنه
    mainInfo.textContent = `#${index + 1} - ⏰ ${event.start} | 🗺️ ${event.map}`;

    // دکمه نمایش جزئیات
    const toggleDetailsBtn = document.createElement("button");
    toggleDetailsBtn.textContent = "نمایش جزئیات";
    toggleDetailsBtn.style.marginRight = "10px";
    toggleDetailsBtn.style.background = "#007bff";
    toggleDetailsBtn.style.color = "white";
    toggleDetailsBtn.style.border = "none";
    toggleDetailsBtn.style.borderRadius = "6px";
    toggleDetailsBtn.style.padding = "4px 8px";
    toggleDetailsBtn.style.cursor = "pointer";

    // دکمه حذف
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "حذف";
    deleteBtn.style.marginRight = "10px";
    deleteBtn.style.background = "red";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.style.padding = "4px 8px";

    // container برای دمو (جزئیات)
    const demo = document.createElement("div");
    demo.className = "event-demo";
    demo.style.marginTop = "8px";
    demo.style.padding = "8px";
    demo.style.background = "#3b3b3b";
    demo.style.borderRadius = "10px";
    demo.style.display = "none"; // اول مخفی باشه
    demo.innerHTML = `
      <p><strong>تاریخ شروع:</strong> ${event.start}</p>
      <p><strong>نقشه انتخاب‌شده:</strong> ${event.map}</p>
      <p><strong>وضعیت:</strong> در انتظار شروع...</p>
    `;

    // رویداد کلیک روی دکمه نمایش جزئیات
    toggleDetailsBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // از انتشار رویداد جلوگیری کن
      if (demo.style.display === "none") {
        demo.style.display = "block";
        toggleDetailsBtn.textContent = "پنهان کردن جزئیات";
      } else {
        demo.style.display = "none";
        toggleDetailsBtn.textContent = "نمایش جزئیات";
      }
    });

    // رویداد کلیک روی دکمه حذف
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // کلیک روی حذف دمو رو باز نکنه
      deleteEvent(index);
    });

    li.appendChild(mainInfo);
    li.appendChild(toggleDetailsBtn);
    li.appendChild(deleteBtn);
    li.appendChild(demo);
    list.appendChild(li);
  });
}


