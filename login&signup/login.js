document.getElementById("login-form").addEventListener("submit", function(e){
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const userDataList = JSON.parse(localStorage.getItem("UserDataList")) || [];

    const matchedUser = userDataList.find(user => 
        user.username === username && user.password === password
    );

    if (matchedUser) {
        localStorage.setItem("currentUser", matchedUser.username);
        alert("شما با موفقیت وارد شدید");
        window.location.href ="../home/home.html"
    } else {
        alert("کاربری با این مشخصات یافت نشد");
    }

});
