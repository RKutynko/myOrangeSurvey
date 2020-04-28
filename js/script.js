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
    if ($(this).attr("value") == "yes") {
      $("#noAnswer").hide("slow");
      $("#yesAnswer").show("slow");
    }
    if ($(this).attr("value") == "no") {
      $("#yesAnswer").hide("slow");
      $("#noAnswer").show("slow");
    }
  });

  $('input[type="radio"]').trigger("click"); // trigger the event

  $('input[type="submit"]').click(function () {
    let question_id = $(this).data("qid");
    let log = {};
    $("#questionBody" + question_id + " input")
      .not('input[type="submit"]')
      .each(function () {
        let label = $('label[for="' + $(this).attr("id") + '"]')
          .text()
          .trim();
        let key = "Q" + question_id + "-" + label;
        let flag;
        if ($(this).is(":checked")) {
          flag = "True";
        } else {
          flag = "False";
        }
        log[key] = flag;
      });
    console.log("log", log);

  });
});
