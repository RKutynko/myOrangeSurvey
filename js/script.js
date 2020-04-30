$(document).ready(function () {
  $(".question_checkbox input").change(function () {
    if ($(".question_checkbox input:checked").length) {
      $(".question_checkbox")
        .siblings(".submit_btn__wrapper")
        .addClass("active");
    } else {
      $(".question_checkbox")
        .siblings(".submit_btn__wrapper")
        .removeClass("active");
    }
  });

  $(".question_radio input").change(function () {
    if ($(".question_radio input:checked").length) {
      $(".question_radio").siblings(".submit_btn__wrapper").addClass("active");
    } else {
      $(".question_radio")
        .siblings(".submit_btn__wrapper")
        .removeClass("active");
    }
  });

  /*$(".question_textarea").change(function () {
    if ($(this).val().length > 0) {
      $(this).siblings(".submit_btn__wrapper").addClass("active");
    } else {
      $(this).siblings(".submit_btn__wrapper").removeClass("active");
    }
  });*/

  //handling answers by click on the Suivant button
  $('input[type="submit"]').click(function () {
    let question_id = $(this).data("qid");
    let question_type = $(this).data("qtype");

    let key = "Q" + $(this).data("qid") + $(this).data("qflow");
    let log = {};

    switch (question_type) {
      case "checkbox":
        let answers = [];
        $("#questionBody" + question_id + ' input[type="checkbox"]').each(
          function () {
            let label = $('label[for="' + $(this).attr("id") + '"]')
              .text()
              .trim();
            if ($(this).is(":checked")) {
              answers.push(label);
            }
          }
        );
        log["question_page"] = key;
        log["answer"] = answers;
        break;
      case "radio":
        $("#questionBody" + question_id + " .question_radio input").each(
          function () {
            if ($(this).is(":checked")) {
              log["question_page"] = key;
              log["answer"] = $(this).val();
            }
          }
        );
        break;

      case "textarea":
        log["question_page"] = key;
        log["answer"] = $("#questionBody" + question_id + " textarea").val();
        break;

      case "rating":
        $("#questionBody" + question_id + ' input[type="radio"]').each(
          function () {
            if ($(this).is(":checked")) {
              log["question_page"] = key;
              log["answer"] = $(this).val();
            }
          }
        );
        break;

      case "range":
        log["question_page"] = key;
        log["answer"] = $(
          "#questionBody" + question_id + " #questionRangeValue"
        ).val();
        break;
    }

    console.log(log);
  });

  $(".js-range-slider").ionRangeSlider({
    min: 0,
    max: 10,
    from: 5,
    onChange: function (data) {
      $("#questionRangeValue").val(data.from);
    },
  });
});
