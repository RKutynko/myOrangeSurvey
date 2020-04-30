$(document).ready(function () {
  console.log("попадает");
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

  $(".js-range-slider").ionRangeSlider({
    min: 0,
    max: 10,
    from: 5,
    onChange: function (data) {
      $("#questionRangeValue").val(data.from);
    },
  });
});
