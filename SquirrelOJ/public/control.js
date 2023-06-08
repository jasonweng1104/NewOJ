$(document).ready(async function () {
    const gotoLoginHTML = '<button class="nav-button goto-login">登入</button>';
    const gotoProblemsHTML = '<button class="nav-button goto-problems">題庫</button>';
    const gotoLogoutHTML = '<button class="nav-button goto-logout">登出</button>';
    const gotoMyClassHTML = '<button class="nav-button goto-myClass">我的教室</button>';
    const gotoProblemEditorHTML = '<button class="nav-button goto-problemEditor">出題</button>';
    //判斷是否登入
    await $.ajax({
        url: '/session/getname',
        method: 'post',
        success: (res) => {
            console.log(res.name);
            if (res.name) {
                const gotoMyPageHTML = '<button class="nav-button goto-myPage">' + res.name + '</button>';
                $(".buttons-container").append(gotoProblemsHTML);//題庫
                $(".buttons-container").append(gotoProblemEditorHTML);//出題
                $(".buttons-container").append(gotoMyClassHTML);//我的教室
                $(".buttons-container").append(gotoMyPageHTML);//個人檔案
                $(".buttons-container").append(gotoLogoutHTML);//登出
            } else {
                $(".buttons-container").append(gotoProblemsHTML);
                $(".buttons-container").append(gotoLoginHTML);
            }
        },
        error: (xhr, status, err) => {
            console.log(err);
        }
    });
    $(".goto-login").on("click", function () {
        window.location.href = "/login.html";
        console.log("login被點擊了！");
    });
    $(".goto-myClass").on("click", function () {
        window.location.href = "/myClass.html";
        console.log("myClass被點擊了！");
    });
    $(".goto-problemEditor").on("click", function () {
        window.location.href = "/problemEditor.html";
        console.log("problemEditor被點擊了！");
    });
    $(".goto-myPage").on("click", function () {
        window.location.href = "/myPage.html";
        console.log("myPage被點擊了！");
    });
    $(".goto-register").on("click", function () {
        window.location.href = "/register.html";
        console.log("register被點擊了！");
    });
    $(".goto-logout").on("click", async function () {
        //登出鈕在這裡
        // 调用函数以删除名为`token`的cookie
        await $.ajax({
            url: '/logout/submit',
            method: 'GET'
        });
        location.reload();
        console.log("logout被點擊了！");
    });
    $(".goto-problems").on("click", function () {
        window.location.href = '/problems.html';
        console.log("problems被點擊了！");
    });
});