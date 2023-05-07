document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle');
    const theme = localStorage.getItem('theme');
  
    if (theme) {
      applyTheme(theme);
      toggle.checked = (theme === 'dark') ? true : false;
    }
  
    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        localStorage.setItem('theme', 'dark');
        applyTheme('dark');
      } else {
        localStorage.setItem('theme', 'light');
        applyTheme('light');
      }
    });
  
    function applyTheme(selectedTheme) {
      const body = document.body;
      const container = document.querySelector('.container');
  
      if (selectedTheme === 'dark') {
        body.style.backgroundColor = 'var(--dark-background)';
        container.style.backgroundColor = 'var(--dark-background)';
      } else {
        body.style.backgroundColor = 'var(--light-background)';
        container.style.backgroundColor = 'var(--container-background-color)';
      }
    }
  });
//最後，在每個 HTML 頁面的 <body> 標籤底部添加對 theme.js 的引用：   <script src="theme.js"></script>
  