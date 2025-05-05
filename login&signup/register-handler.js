document.getElementById("rigister-form").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const passwordAgain = document.getElementById("passwordAgain").value;
    const email = document.getElementById("email").value.trim();
    const agree = document.getElementById("agree").checked;
  
    if (!fullName || !username || !password || !passwordAgain || !email) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }
  
    if (!agree) {
      alert("برای ثبت‌نام باید قوانین را بپذیرید.");
      return;
    }
  
    if (password !== passwordAgain) {
      alert("رمز عبور و تکرار آن یکسان نیست!");
      return;
    }
  
    const existingData = JSON.parse(localStorage.getItem("UserDataList")) || [];
  
    existingData.push({
      fullName,
      username,
      password,
      email
    });
  
    localStorage.setItem("UserDataList", JSON.stringify(existingData));
  
    alert("ثبت‌نام با موفقیت انجام شد!");
    window.location.href = "login.html";
  });
  