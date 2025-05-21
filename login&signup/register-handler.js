// Supabase config
const supabaseUrl = 'https://ufyvptgaoottqqemcnue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeXZwdGdhb290dHFxZW1jbnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjMxNDUsImV4cCI6MjA2MzI5OTE0NX0.yHeTSEoYhAxappOhZlKYRbBJhHDDN_DO514iHYkUoTw'; // کلیدتو کامل بذار
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
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

    try {
      const { data, error } = await supabase.from("users").insert([
        {
          fullName,
          username,
          password, // هش کردن رو بعداً اضافه کن
          email,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) {
        console.error("خطا در ثبت‌نام:", error);
        alert("خطا در ثبت‌نام: " + error.message);
      } else {
        alert("ثبت‌نام با موفقیت انجام شد!");
        form.reset();
        window.location.href = "login.html";
      }
    } catch (err) {
      console.error("خطای سیستمی:", err);
      alert("خطا در سیستم: " + err.message);
    }
  });
});
