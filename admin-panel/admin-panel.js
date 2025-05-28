import { setupEventSteps } from './event.js';

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

  // ⬇️ بارگذاری اولیه داشبورد هنگام باز شدن صفحه
  fetch(`sections/dashboard.html`)
    .then(res => res.text())
    .then(data => {
      contentSection.innerHTML = data;
      // لینک داشبورد رو هم فعال کن
      const defaultLink = document.querySelector('[data-section="dashboard"]');
      if (defaultLink) {
        sidebarLinks.forEach(item => item.classList.remove("active-link"));
        defaultLink.classList.add("active-link");
      }
    })
    .catch(err => {
      contentSection.innerHTML = `<p style="color:red;">خطا در بارگذاری داشبورد</p>`;
      console.error(err);
    });
});
 
