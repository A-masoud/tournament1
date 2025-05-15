
const users = JSON.parse(localStorage.getItem("UserDataList")) || [];
const NumberMember = users.length;
document.getElementById("UserCount").textContent = NumberMember;


document.addEventListener("DOMContentLoaded", function () {
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
