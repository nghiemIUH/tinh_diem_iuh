$(document).ready(() => {
    $(function () {
        $("select").select2();
    });

    $('select').change(function () {
        $('input[type="text"]').val('')
        let id = $(this).attr('id')
        if ($('option:selected', this).attr('class') == 'False') {
            $(`input[class='sm-th-${id}']`).prop('disabled', true)
        } else {
            $(`input[class='sm-th-${id}']`).prop('disabled', false)
        }
    })

    $('input[type="text"]').change(function () {
        // console.log(1)
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
        $("form").submit();
    });

    $("form").submit(function (e) {
        e.preventDefault();
        var serializedData = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "",
            data: serializedData,
            success: (response) => {
                he10 = response["he10"];
                he4 = response["he4"];
                for (let i = 1; i < 11; i++) {
                    if (he10[i] != 0) {
                        $(`#he10-${i}`).val(he10[i]);
                        $(`#he4-${i}`).val(he4[i]);
                    } else {
                        $(`#he10-${i}`).val('');
                        $(`#he4-${i}`).val('');
                    }
                }
                $(".result").remove();
                let result = $('<div class = "result"></div>');
                result.append(
                    `<h5>Trung bình hệ 10: <b>${response["tb_10"]}</b></h5>`
                );
                result.append(
                    `<h5>Trung bình hệ 4: <b>${response["tb_4"]}</b></h5>`
                );
                $(".container").append(result);
            },
            error: (err) => {
                // let id = err["responseJSON"]["error"];
                // $(`#he10-${id}`).val("");
                // $(`#he4-${id}`).val("");
            },
        });
    });
});