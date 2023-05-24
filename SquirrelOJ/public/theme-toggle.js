document.addEventListener('DOMContentLoaded', function () {
  var themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('change', function () {
    if (themeToggle.checked) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  });
});