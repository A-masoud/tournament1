let currentIndex = 1;
let touchStartX = 0;
let touchEndX = 0;

function displaySlide(n) {
    currentIndex = n;
    const sliders = document.getElementsByClassName("slider");
    const pics = document.getElementsByClassName("pic");

    if (currentIndex > sliders.length) {
        currentIndex = 1;
    }
    if (currentIndex < 1) {
        currentIndex = sliders.length;
    }

    for (let i = 0; i < sliders.length; i++) {
        sliders[i].style.display = "none";
        pics[i].className = "pic Deactivating";
    }

    sliders[currentIndex - 1].style.display = "flex";
    pics[currentIndex - 1].className = "pic active";
}

function changeSlide(n) {
    currentIndex += n;
    displaySlide(currentIndex);
}

function currentSlide(n) {
    displaySlide(n);
}

// اضافه کردن قابلیت کشیدن (swipe)
const container = document.querySelector('.container');

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50; // حداقل فاصله برای تشخیص کشیدن

    if (swipeDistance > minSwipeDistance) {
        // کشیدن به راست -> اسلاید قبلی
        changeSlide(-1);
    } else if (swipeDistance < -minSwipeDistance) {
        // کشیدن به چپ -> اسلاید بعدی
        changeSlide(1);
    }
}

displaySlide(currentIndex);