  let currentSlide = 1;
  const totalSlides = 3;

    setInterval(() => {
    currentSlide++;
    if (currentSlide > totalSlides) {
      currentSlide = 1;
    }
    document.getElementById(`s${currentSlide}`).checked = true;
  }, 3000);