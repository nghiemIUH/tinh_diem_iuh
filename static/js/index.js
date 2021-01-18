$(document).ready(() => {
    let ten_mon = $("select>option").map(function () {
        return $(this).text();
    });
    let id_mon = $("select>option").map(function () {
        return $(this).val();
    });
    let list_class = $("select>option").map(function () {
        return $(this).attr('class');
    });

    let rowCount = 1
    $('#them').click(function () {
        rowCount++
        let row = $(`<tr id="${rowCount}"></tr>`)
        let select = $(`<select id="select_mon-${rowCount}" >`)
        select.append(`<option values="${rowCount}">Môn học</option>`)
        for (let i = 1; i < ten_mon.length; i++) {
            select.append(`<option class="${list_class[i]}" value="${id_mon[i]}">${ten_mon[i]}</option>`)
        }
        row.append($('<td></td>').append(select))

        for (let i = 1; i < 6; i++) {
            row.append(`<td>
                            <input type="text" name="tk${i}-${rowCount}" id="sm-tk${i}-${rowCount}" autocomplete="off" />
                        </td>`)
        }

        row.append(`<td>
                        <input type="text" name="gk-${rowCount}" id="sm-gk-${rowCount}" autocomplete="off" />
                    </td>`)

        for (let i = 1; i < 4; i++) {
            row.append(`<td>
                            <input type="text" name="th${i}-${rowCount}" class="sm-th-${rowCount}" autocomplete="off" />
                        </td>`)
        }

        row.append(`<td>
                        <input type="text" name="ck-${rowCount}" id="sm-ck-${rowCount}" autocomplete="off" />
                    </td>`)

        row.append(`<td>
                        <input disabled type="text" id="he10-${rowCount}" />
                    </td>`)
        row.append(`<td>
                        <input disabled type="text" id="he4-${rowCount}" />
                    </td>`)

        $('#table').append(row)
        $("select").select2();
    })


    $(function () {
        $("select").select2();
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
    const csrftoken = getCookie('csrftoken');
    let monHoc = 0

    $(document).on('change', 'select', function () {
        $('input[type="text"]').val('')
        let id = $(this).parent().parent().attr('id')
        if ($('option:selected', this).attr('class') == 'False') {
            $(`input[class='sm-th-${id}']`).prop('disabled', true)
        } else {
            $(`input[class='sm-th-${id}']`).prop('disabled', false)
        }
        let url = window.location.href
        let id_mon_hoc = $(`#select_mon-${id} option:selected`).val();
        $.post(`${url}get-mon-hoc/`, {
            'id': id_mon_hoc,
            'csrfmiddlewaretoken': csrftoken
        }, function (data) {
            monHoc = data
        })
    })



    $(document).on('change', 'input[type="text"]', function () {
        let point = $(this).val();
        let regex = new RegExp("^[0-9.]+$");
        let regex_class = new RegExp("^sm-tin-chi-.+$");
        if (point == "") {
            $(this).css("border-color", "lightgray");
        } else if (point == ".") {
            $(this).css("border-color", "red");
        } else if (regex.test(point)) {
            $(this).css("border-color", "black");
            if (
                point <= 5 ||
                (point > 10 && !regex_class.test($(this).attr("id")))
            ) {
                $(this).css("color", "red");
            } else {
                $(this).css("color", "black");
            }
        } else {
            $(this).css("border-color", "red");
        }

        let row = $(this).parent().parent().attr('id')
        tinh_diem(row)
    });

    function tinh_diem(row) {
        let list_tk = []
        let gk
        let ck
        for (let i = 1; i < 6; i++) {
            let diem = $(`input[name='tk${i}-${row}']`).val()
            if (diem != '')
                list_tk.push(parseFloat(diem))
        }
        if (list_tk.length == 0)
            return
        let trung_binh_tk = list_tk.reduce(function (a, b) {
            return a + b
        }, 0) / list_tk.length

        gk = $(`input[name='gk-${row}']`).val()
        if (gk != '')
            gk = parseFloat(gk)
        else
            return

        ck = $(`input[name='ck-${row}']`).val()
        if (ck != '')
            ck = parseFloat(ck)
        else
            return

        let trung_binh = (trung_binh_tk * 20 + gk * 30 + ck * 50) / 100


        if (monHoc['thuc_hanh']) {
            let list_th = []
            for (let i = 1; i < 4; i++) {
                let diem = $(`input[name='th${i}-${row}']`).val()
                if (diem != '')
                    list_th.push(parseFloat(diem))

            }
            if (list_th.length == 0)
                return
            let trung_binh_th = list_th.reduce(function (a, b) {
                return a + b
            }, 0) / list_th.length

            trung_binh = (trung_binh_th * data['chi_th'] + trung_binh * (data['tong_chi'] - data['chi_th'])) / data['tong_chi']
            console.log(trung_binh)
        }
        $(`input[id=he10-${row}]`).val(trung_binh)
        $(`input[id=he4-${row}]`).val(chuyen10Sang4(trung_binh))
    }

    function chuyen10Sang4(diem) {
        if (diem >= 9)
            diem = 4
        else if (diem >= 8.5)
            diem = 3.8
        else if (diem >= 8)
            diem = 3.5
        else if (diem >= 7)
            diem = 3
        else if (diem >= 6)
            diem = 2.5
        else if (diem >= 5.5)
            diem = 2
        else if (diem >= 5)
            diem = 1.5
        else if (diem >= 4)
            diem = 1
        else
            diem = 0
        return diem
    }

});