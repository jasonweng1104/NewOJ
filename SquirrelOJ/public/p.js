$(document).ready(function () {
    var url = window.location.search;
    var param = new URLSearchParams(url);
    var _id = param.get('ID');
    $.ajax({
        url: '/p/getProblem/' + _id, // Replace with your server-side endpoint URL
        method: 'GET',
        success: function (response) {
            // Handle the response from the server
            const { TITLE, EXPLAIN, INPUT, OUTPUT, CLASS, TAG, ex_num, hd_num, ex_array, hd_array } = response;
            $('#pTITLE').text(TITLE);
            $('#pEXPLAIN').text(EXPLAIN);
            $('#pINPUT').text(INPUT);
            $('#pOUTPUT').text(OUTPUT);
            for (var i = 1; i <= ex_num; i++) {
                var txt = '<div class="row">'
                    + '<div class="col box">'
                    + '<h5>範例輸入#' + i + '</h5>'
                    + '<p id="pex-input-' + i + '">' + ex_array[i - 1][0] + '</p>'
                    + '</div>'
                    + '<div class="col box">'
                    + '<h5>範例輸出#' + i + '</h5>'
                    + '<p id="pex-output-' + i + '">' + ex_array[i - 1][1] + '</p>'
                    + '</div>'
                    + '</div>'
                $('.container').append(txt.replace(/\n/g, "<br>"));
            }
            console.log(response);
        },
        error: function (xhr, status, error) {
            // Handle any errors
            console.error(error);
        }
    });
    $('#submit').click(() => {
        // 将程式码和 ID 作为数据发送到服务器
        console.log($('#code').val());
        $.ajax({
            method: 'POST',
            url: '/processProblem',
            data: {
                code: $('#code').val(),
                id: _id
            },
            success: function (response) {
                alert('处理成功');
                // 在这里处理服务器返回的响应
            },
            error: function () {
                console.log('处理出错，请重试');
            }
        });

    });
});