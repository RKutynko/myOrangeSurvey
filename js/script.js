$(document).ready(function () {
  let rangeSlider = document.getElementById("rangeSlider");
  let rangeBullet = document.getElementById("rangeValue");
  rangeSlider.addEventListener("input", showSliderValue, false);

  function showSliderValue() {
    rangeBullet.innerHTML = rangeSlider.value;
    let bulletPosition = rangeSlider.value / rangeSlider.max;

    console.log(rangeSlider.offsetWidth);

    rangeBullet.style.left = (bulletPosition * (rangeSlider.offsetWidth - 22)) + "px";
  }

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
});
