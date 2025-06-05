function showSection(id) {
    const sections = document.querySelectorAll('.panel-section');
    sections.forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
  }

  function logout() {
    alert('خروج انجام شد!');
   
  }