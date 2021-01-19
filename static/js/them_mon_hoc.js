$(document).ready(function () {
    $("input[type='checkbox']").change(function () {
        $("#chi_th").prop("disabled", !this.checked)
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    let check = 'off'

    $("input[type='checkbox']").change(function () {
        if (this.checked) {
            check = 'on'
            $('input[name="chi_th"]').val(1)
        } else {
            check = 'off'
        }
    });

    $('#them').click(function () {
        let values = {
            'ten': $('input[name="ten"]').val(),
            'tong_chi': $('input[name="tong_chi"]').val(),
            'thuc_hanh': check,
            'chi_th': $('input[name="chi_th"]').val(),
            'csrfmiddlewaretoken': getCookie('csrftoken')
        }
        let url = window.location.href
        $.post(url, values, function (data, status) {
            let row = $(`<tr id='${data['id']}' ></tr>`)
            row.append(`<td>${data['ten']}</td>`)
            row.append(`<td>${data['thuc_hanh']}</td>`)
            row.append(`<td>${data['tong_chi']}</td>`)
            row.append(`<td>${data['chi_th']}</td>`)
            $('#tb_monHoc').append(row)
            $('input').val('')
        })
    })

});