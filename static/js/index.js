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
        select.append(`<option class="False" values="${rowCount}">Môn học</option>`)
        for (let i = 1; i < ten_mon.length; i++) {
            select.append(`<option class="${list_class[i]}" value="${id_mon[i]}">${ten_mon[i]}</option>`)
        }
        row.append($('<td></td>').append(select))

        for (let i = 1; i < 6; i++) {
            row.append(`<td>
                            <input type="text" name="tk${i}-${rowCount}" class="sm-${rowCount}" autocomplete="off" />
                        </td>`)
        }

        row.append(`<td>
                        <input type="text" name="gk-${rowCount}" class="sm-${rowCount}" autocomplete="off" />
                    </td>`)

        for (let i = 1; i < 4; i++) {
            row.append(`<td>
                            <input type="text" name="th${i}-${rowCount}" class="sm-${rowCount}-th" autocomplete="off" />
                        </td>`)
        }

        row.append(`<td>
                        <input type="text" name="ck-${rowCount}" class="sm-${rowCount}" autocomplete="off" />
                    </td>`)

        row.append(`<td>
                        <input disabled type="text" id="he10-${rowCount}" class="sm-${rowCount}"/>
                    </td>`)
        row.append(`<td>
                        <input disabled type="text" id="he4-${rowCount}" class="sm-${rowCount}"/>
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

    function getMonHoc(id_mon_hoc) {
        let url = window.location.href + 'get-mon-hoc/'
        $.post(url, {
            'id': id_mon_hoc,
            'csrfmiddlewaretoken': csrftoken
        }, function (data) {
            monHoc = data
        })
    }

    $(document).on('change', 'select', function () {
        let id = $(this).parent().parent().attr('id')
        $(`input[class^='sm-${id}']`).val('')
        if ($('option:selected', this).attr('class') == 'False') {
            $(`input[class='sm-${id}-th']`).prop('disabled', true)
        } else {
            $(`input[class='sm-${id}-th']`).prop('disabled', false)
        }

        let id_mon_hoc = $(`#select_mon-${id} option:selected`).val();
        getMonHoc(id_mon_hoc)

    })

    $(document).on('change', 'input[type="text"]', function () {
        let row = $(this).parent().parent().attr('id')
        getMonHoc()
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
        if (list_tk.length == 0) {
            $(`input[id=he10-${row}]`).val('')
            $(`input[id=he4-${row}]`).val('')
            return
        }

        let trung_binh_tk = list_tk.reduce(function (a, b) {
            return a + b
        }, 0) / list_tk.length

        gk = $(`input[name='gk-${row}']`).val()
        if (gk != '')
            gk = parseFloat(gk)
        else {
            $(`input[id=he10-${row}]`).val('')
            $(`input[id=he4-${row}]`).val('')
            return
        }


        ck = $(`input[name='ck-${row}']`).val()
        if (ck != '')
            ck = parseFloat(ck)
        else {
            $(`input[id=he10-${row}]`).val('')
            $(`input[id=he4-${row}]`).val('')
            return
        }


        let trung_binh = (trung_binh_tk * 20 + gk * 30 + ck * 50) / 100

        if (monHoc['thuc_hanh']) {
            let list_th = []
            for (let i = 1; i < 4; i++) {
                let diem = $(`input[name='th${i}-${row}']`).val()
                if (diem != '')
                    list_th.push(parseFloat(diem))
            }
            if (list_th.length == 0) {
                $(`input[id=he10-${row}]`).val('')
                $(`input[id=he4-${row}]`).val('')
                return
            }
            let trung_binh_th = list_th.reduce(function (a, b) {
                return a + b
            }, 0) / list_th.length

            trung_binh = (trung_binh_th * monHoc['chi_th'] + trung_binh * (monHoc['tong_chi'] - monHoc['chi_th'])) / monHoc['tong_chi']
            console.log(trung_binh)
        }
        $(`input[id=he10-${row}]`).val(trung_binh)
        $(`input[id=he4-${row}]`).val(chuyen10Sang4(trung_binh))
        tinhDiemTB()
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

    function tinhDiemTB() {
        let tong_10 = 0;
        let tong_4 = 0;
        let tong_chi = 0
        for (let i = 1; i <= rowCount; i++) {
            let diem_10 = $(`input[id=he10-${i}]`).val()
            if (diem_10 != '') {
                getMonHoc()
                tong_chi += monHoc['tong_chi']
                tong_10 += parseFloat(diem_10) * monHoc['tong_chi']
                tong_4 += parseFloat($(`input[id=he4-${i}]`).val()) * monHoc['tong_chi']
            }
        }
        tong_10 = tong_10 / tong_chi
        tong_4 = tong_4 / tong_chi
        if (tong_10 != 0) {
            $('.container').append(`<h4>Trung bình chung hệ 10: ${tong_10}</h4>`)
            $('.container').append(`<h4>Trung bình chung hệ 4: ${tong_4}</4>`)

        }
    }

});