$(document).ready(() => {
    $.ajax({
        url: '/session/getAll', // 替换为您的服务器端端点 URL
        method: 'POST',
        success: function (response) {
            $('#name').text(response.name);
            $('#email').text(response.email);
        }
    });
});