const users = JSON.parse(localStorage.getItem("UserDataList"))||[];

const NumberMember = users.length;

console.log(NumberMember)

document.getElementById("UserCount").textContent = NumberMember;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll(".sidebar a");
    const contentSection = document.querySelector(".content");
  
    sidebarLinks.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const section = this.dataset.section;
        fetch(`sections/${section}.html`)
          .then(res => res.text())
          .then(data => {
            contentSection.innerHTML = data;
            // اگه بخش کاربران بود، جدول رو رندر کن
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
  
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let UserDataList = JSON.parse(localStorage.getItem("UserDataList")) || [];

function renderTable() {
  const tableBody = document.getElementById("table-body");
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


renderTable();
