$(document).ready(function () {
    $("input[type='checkbox']").change(function () {
        $("#chi_th").prop("disabled", !this.checked)
    });

    $('#form_mh').submit(function (e) {
        e.preventDefault();
        var serializedData = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "/mon-hoc/",
            data: serializedData,
            success: (response) => {
                let table = document.getElementById('tb_monHoc')
                let row = table.insertRow(-1)
                row.insertCell(0).innerHTML = response['ten']
                row.insertCell(1).innerHTML = response['thuc_hanh']
                row.insertCell(2).innerHTML = response['tong_chi']
                row.insertCell(3).innerHTML = response['chi_th']

                $('input').val('')
            },

        });
    });

});