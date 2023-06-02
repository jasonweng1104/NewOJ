$(document).ready(function () {
    const gotoLoginHTML = '<button class="nav-button goto-login">登入</button>';
    const gotoProblemsHTML = '<button class="nav-button goto-problems">題庫</button>';
    const gotoLogoutHTML = '<button class="nav-button goto-logout">登出</button>';
    $(".buttons-container").append(gotoLoginHTML);
    $(".buttons-container").append(gotoProblemsHTML);
    $(".buttons-container").append(gotoLogoutHTML);
    $(".goto-login").on("click", function () {
        window.location.href = "/login.html";
        console.log("login被點擊了！");
    });
    $(".goto-logout").on("click", function () {
        //登出鈕在這裡
        console.log("logout被點擊了！");
    });
    $(".goto-problems").on("click", function () {
        window.location.href = '/problems.html';
        console.log("problems被點擊了！");
    });
});
