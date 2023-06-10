$(document).ready(function () {
    $.ajax({
        url: '/problems/getAll',
        method: 'POST',
        success: function (res) {
            // 遍歷每個文件
            var i = 1;
            res.forEach(function (doc) {
                // 輸出每個變數
                console.log('_id:', doc._id);
                console.log('TITLE:', doc.TITLE);
                console.log('CLASS:', doc.CLASS);
                console.log('TAG:', doc.TAG);
                const txt = '<tr>'
                    + '<td>' + i++ + '</td>'
                    + '<th><a href="/p.html?ID=' + doc._id + '">' + doc.TITLE + '</a></th>'
                    + '<td>95%</td>'
                    + '<td>Easy</td>'
                    + '<td>' + doc.CLASS + '</td>'
                    + '<td>' + doc.TAG + '</td>'
                    + '</tr>';
                $('table').append(txt);
            });
            //刪除按鈕
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
});
