const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  menu.classList.toggle('active');
});

document.querySelectorAll('.has-submenu > a').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault(); // جلوگیری از رفتن به لینک
    const parent = this.parentElement;

    // بستن همه‌ی ساب‌منوها به جز مورد کلیک‌شده
    document.querySelectorAll('.has-submenu').forEach(el => {
      if (el !== parent) {
        el.classList.remove('open-submenu');
      }
    });

    // باز یا بسته کردن ساب‌منوی مورد نظر
    parent.classList.toggle('open-submenu');
  });
});
