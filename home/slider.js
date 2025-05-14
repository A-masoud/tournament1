let currentIndex = 0;
let autoSlideInterval;

function moveSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }

    updateSlider();
}

function currentSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    if (index >= 1 && index <= totalSlides) {
        currentIndex = index - 1;
        updateSlider();
        resetAutoSlide(); // ریست تایمر هنگام کلیک کاربر
    }
}

function updateSlider() {
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveSlide(1); // هر 3.5 ثانیه به اسلاید بعدی برو
    }, 3500);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval); // توقف تایمر فعلی
    startAutoSlide(); // شروع مجدد تایمر
}

startAutoSlide();
//////////////////////////////////////////////////////////////////////
