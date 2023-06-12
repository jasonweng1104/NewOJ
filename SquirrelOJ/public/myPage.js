$(document).ready(() => {
    $.ajax({
        url: '/myPage/getAll/', // 替换为您的服务器端端点 URL
        method: 'POST',
        success: function (response) {
            // 在这里处理服务器返回的响应，即用户数据
            console.log(response); // 这里打印用户数据，可以根据需要进行处理
            // 继续处理用户数据...

            // 示例：将用户名、邮箱等信息显示在页面上
            $('#name').text(response.name);
            $('#email').text(response.email);
            // 可以根据需要继续设置其他字段的值

            // 示例：遍历 AC_ids 数组
            response.AC_ids.forEach(function (acId) {
                console.log(acId); // 对每个 AC_id 进行相应处理
            });

            // 示例：遍历 JU_array 数组

            var juArray = response.JU_array;
            for (var i = juArray.length - 1; i >= 0; i--) {
                console.log(juArray); // 对每个 JU_array 进行相应处理
                var txt = '<tr>'
                    + '<td>' + (juArray.length - i) + '</td>'
                    + '<td>' + juArray[i][1] + '</td>'
                    + '<td>' + juArray[i][2] + '</td>'
                    + '<td>' + juArray[i][3] + '</td>'
                    + '</tr>';
                $('#submitTable').append(txt);
            }
        },
        error: function () {
            console.log('处理出错，请重试');
        }
    });
});
