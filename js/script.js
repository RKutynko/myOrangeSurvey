var rangeSlider = document.getElementById("rangeSlider");
var rangeBullet = document.getElementById("rangeValue");
rangeSlider.addEventListener("input", showSliderValue, false);
function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = rangeSlider.value / rangeSlider.max;
  rangeBullet.style.left = bulletPosition * rangeSlider.offsetWidth + "px";
  console.log("bulletPosition", bulletPosition);
  console.log("rangeSlider.offsetWidth", rangeSlider.offsetWidth);
}

$(document).ready(function () {
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

  $('input[type="radio"]').trigger("click"); // trigger the event

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
          let val = $(
            "#questionBody" + question_id + " #yesAnswer .range_wrapper input"
          ).val();
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

    FollowAnalytics.logEvent("Survey_Analytics", log);
  });
});
