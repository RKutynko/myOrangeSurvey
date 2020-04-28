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
