$(document).ready(function () {
    const gotoLoginHTML = '<button class="nav-button goto-login">登入</button>';
    const gotoProblemsHTML = '<button class="nav-button goto-problems">題庫</button>';
    $(".buttons-container").append(gotoLoginHTML);
    $(".buttons-container").append(gotoProblemsHTML);
    $(".goto-login").on("click", function () {
        window.location.href = "/login.html";
        console.log("login被點擊了！");
    });

    $(".goto-problems").on("click", function () {
        window.location.href = '/problems.html';
        console.log("problems被點擊了！");
    });
});
