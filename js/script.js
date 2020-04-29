$(document).ready(function () {
  $(".question_checkbox input").change(function () {
    if ($(".question_checkbox input:checked").length) {
      $(".question_checkbox").siblings(".submit_btn__wrapper").addClass("active");
    } else {
      $(".question_checkbox").siblings(".submit_btn__wrapper").removeClass("active");
    }
  });

  $(".question_radio input").change(function () {
    if ($(".question_radio input:checked").length) {
      $(".question_radio").siblings(".submit_btn__wrapper").addClass("active");
    } else {
      $(".question_radio").siblings(".submit_btn__wrapper").removeClass("active");
    }
  });


  //handling answers by click on the Suivant button
  $('input[type="submit"]').click(function () {
    let question_id = $(this).data("qid");
    let question_type = $(this).data("qtype");
    let log = {};

    switch (question_type) {
      case "checkbox":
        $("#questionBody" + question_id + " input")
          .not('input[type="submit"]')
          .each(function () {
            let label = $('label[for="' + $(this).attr("id") + '"]')
              .text()
              .trim();
            let key = "Q" + question_id + "-" + label;
            let val;
            if ($(this).is(":checked")) {
              val = "True";
            } else {
              val = "False";
            }
            log[key] = val;
          });

        break;
      case "radio":
        const positiveFlowSymbol = "A";
        const negativeFlowSymbol = "B";
        let flag;
        $("#questionBody" + question_id + " .question_radio input").each(
          function () {
            let key = "Q" + question_id + ".1";
            let val;

            if ($(this).is(":checked")) {
              val = $(this).val();
              log[key] = val;

              if (val.toLowerCase() == "yes" || val.toLowerCase() == "oui") {
                flag = true;
              } else {
                flag = false;
              }
            }
          }
        );

        if (flag) {
          //positive flow
          //handling rating
          $(
            "#questionBody" +
              question_id +
              " #yesAnswer .emotions_wrapper input"
          ).each(function () {
            let key = "Q" + question_id + ".2" + positiveFlowSymbol;
            let val;
            if ($(this).is(":checked")) {
              val = $(this).val();
              log[key] = val;
            }
          });

          //handling range
          let key = "Q" + question_id + ".3" + positiveFlowSymbol;
          let val = $("#questionRangeValue").val();
          log[key] = val;
        } else {
          //negative flow
          let key = "Q" + question_id + ".2" + negativeFlowSymbol;
          let val = $(
            "#questionBody" + question_id + " #noAnswer textarea"
          ).val();
          log[key] = val;
        }
        break;
      case "textarea":
        let key = "Q" + question_id;
        let val = $("#questionBody" + question_id + " textarea").val();
        log[key] = val;
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

  $('.question_radio input[type="radio"]').click(function () {
    let val = $(this).attr("value").toLowerCase();
    if (val == "yes" || val == "oui") {
      $("#noAnswer").hide("slow");
      $("#yesAnswer").show("slow");
    }
    if (val == "no" || val == "non") {
      $("#yesAnswer").hide("slow");
      $("#noAnswer").show("slow");
    }
  });
});
