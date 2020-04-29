import $ from "jquery";
import _ from "lodash";
import "./css/style.css";
import { handleConsoleMessage } from "./lib/utils";
import { FollowAnalyticsWrapper } from "./lib/FollowAnalyticsWrapper";

const CURRENT_PAGE_KEY = "currentPage";
let currentPage = 0;
let lastPage = 0;

const setActivePage = (index) => {
  $(".pageContainer").each((_idx, node) => {
    node.removeAttribute("class");
    node.className = "pageContainer";
  });

  for (let i = 0; i <= lastPage; i++) {
    const page = $(`#page-${i}`);
    if (i < index) page.addClass("pageContainer--previous");
    if (i === index) page.addClass("pageContainer--current");
    if (i > index) page.addClass("pageContainer--next");
  }

  currentPage = index;
  if (typeof FollowAnalytics.CurrentCampaign.setData === "function") {
    console.log(`Save page: ${index}`);
    FollowAnalytics.CurrentCampaign.setData(CURRENT_PAGE_KEY, index);
  }
};

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
          "#questionBody" + question_id + " #yesAnswer .emotions_wrapper input"
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
  setActivePage(++currentPage);
});

$(window).on("load", () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (typeof FollowAnalytics.CurrentCampaign.getData === "function") {
      const savedPage = FollowAnalytics.CurrentCampaign.getData(
        CURRENT_PAGE_KEY
      );
      currentPage = savedPage || 0;
      if (!_.isUndefined(savedPage)) {
        console.log(`Fetched saved page: ${savedPage}`);
      }
    }
    if (typeof FollowAnalyticsParams === "undefined") {
      throw {
        severity: "warning",
        message: "Missing template parameters, shutting down.",
      };
    }
    lastPage = _.size(FollowAnalyticsParams.questions) + 1; // because size(FollowAnalyticsParams.questions) - 1 + start page + finish page

    const templateContainer = $(".multiFullcreenTemplate");

    /*----------------------------GENERAL CONFIGS-----------------------------*/
    let general_params = FollowAnalyticsParams.general_params;

    //handling image
    const image = $('<div class="message_avatar" />');
    if (!!general_params.image) {
      const image = $('<div class="message_avatar" />');
      image.css({
        backgroundImage: `url(${general_params.image})`,
      });
    }
    

    /*--------------------------START PAGE--------------------------*/
    let start_params = FollowAnalyticsParams.start_params;
    const startPageContainer = $('<div class="pageContainer" />');
    const greetingPage = $('<div class="message__wrapper" />');
    const imageContainer = $('<div class="message_avatar__wrapper" />');
    imageContainer.append(image);

    const greetingTextContainer = $('<div class="message_text__wrapper" />');
    const greetingTitle = $('<p class="message_title" />');
    greetingTitle.text(start_params.greeting_title);
    greetingTitle.css({
      fontSize: general_params.font_size_title,
      color: general_params.font_color_title,
    });
    const greetingText = $('<p class="message_text" />');
    greetingText.text(start_params.greeting_text);
    greetingText.css({
      fontSize: general_params.font_size_body,
      color: general_params.font_color_body,
    });
    greetingTextContainer.append(greetingTitle);
    greetingTextContainer.append(greetingText);

    const greetingButtonContainer = $('<div class="submit_btn__wrapper" />');
    const greetingButton = $(
      '<button class="submit_btn">' +
        start_params.greeting_button_text +
        "</button>"
    );
    greetingButtonContainer.append(greetingButton);

    greetingPage.append(imageContainer);
    greetingPage.append(greetingTextContainer);
    greetingPage.append(greetingButtonContainer);

    startPageContainer.append(greetingPage);

    templateContainer.append(startPageContainer);
    /*--------------------------END OF START PAGE--------------------------*/

    /*-----------------------QUESTION FOR YES/NO ANSWERS------------------------*/
    const yesContainer = $('<div id="yesAnswer" />');
    const ratingWrapper = $('<div class="rating__wrapper" />');
    const ratingTitle = $('<p class="question_title" />');
    ratingTitle.text(
      FollowAnalyticsParams.feedback_question.text_rating_positive
    );
    const ratingContainer = $(
      ' <div class="feedback_wrapper emotions_wrapper ">' +
        '<div><input type="radio" name="questionYesEmotions" id="emotions1" value="1" />' +
        '<label for="emotions1" class="emotions_icon emotions_icon__1"></label></div>' +
        '<div><input type="radio" name="questionYesEmotions" id="emotions2" value="2" />' +
        '<label for="emotions2" class="emotions_icon emotions_icon__2"></label></div>' +
        '<div><input type="radio" name="questionYesEmotions" id="emotions3" value="3" />' +
        '<label for="emotions3" class="emotions_icon emotions_icon__3"></label></div>' +
        '<div><input type="radio" name="questionYesEmotions" id="emotions4" value="4" />' +
        '<label for="emotions4" class="emotions_icon emotions_icon__4"></label></div>' +
        '<div><input type="radio" name="questionYesEmotions" id="emotions5" value="5" />' +
        '<label for="emotions5" class="emotions_icon emotions_icon__5"></label></div>'
    );
    ratingWrapper.append(ratingTitle);
    ratingWrapper.append(ratingContainer);
    const rangeWrapper = $('<div class="range__wrapper" />');
    const rangeTitle = $('<p class="question_title" />');
    rangeTitle.text(
      FollowAnalyticsParams.feedback_question.text_range_positive
    );
    const rangeContainer = $(
      '<div class="feedback_wrapper range_wrapper">' +
        '<div class="question_range_label__wrapper">' +
        '<span class="question_range_number">0</span>' +
        '<span class="question_range_number">10</span>' +
        "</div>" +
        '<div class="question_range__wrapper">' +
        '<label id="rangeValue" class="question_range_value">5</label>' +
        '<input type="range" min="0" max="10" value="5" name="questionYesRange" class="question_range" id="rangeSlider" />' +
        "</div>" +
        '<div class="question_range_label__wrapper">' +
        '<span class="question_range_label">' +
        FollowAnalyticsParams.feedback_question.text_range_label_from +
        "</span>" +
        '<span class="question_range_label">' +
        FollowAnalyticsParams.feedback_question.text_range_label_to +
        "</span>" +
        "</div>" +
        "</div>"
    );
    rangeWrapper.append(rangeTitle);
    rangeWrapper.append(rangeContainer);

    yesContainer.append(ratingWrapper);
    yesContainer.append(rangeWrapper);

    const noContainer = $('<div id="noAnswer" />');
    const textareaTitle = $('<p class="question_title" />');
    textareaTitle.text(
      FollowAnalyticsParams.feedback_question.text_textarea_negative
    );
    const textareaContainer = $(
      '<div class="feedback_wrapper">' +
        '<textarea class="question_textarea question_input"' +
        'name="questionNo" placeholder="' +
        general_params.textarea_placeholder +
        '"' +
        'maxlength="700" ></textarea>' +
        "</div>"
    );
    noContainer.append(textareaTitle);
    noContainer.append(textareaContainer);
    /*-----------------------END OF QUESTION FOR YES/NO ANSWERS--------------------*/

    /*--------------------------QUESTION PAGE--------------------------*/

    _.forEach(FollowAnalyticsParams.questions, (element, index) => {
      const pageContainer = $(
        `<div id="page-${index}" class="pageContainer" />`
      );
      const questionContainer = $('<div class="question__wrapper" />');
      const questionLabel = $(
        '<p class="question_label">' +
          "Question " +
          index +
          "/" +
          size(FollowAnalyticsParams.questions) +
          "</p>"
      );
      const questionWrapper = $('<div id="questionWrapper" />');
      const questionTitle = $('<p class="question_title" />');
      questionTitle.text(element.question.text);
      const questionBody = $('<div id="questionBody' + index + '" />');

      switch (element.question.type) {
        case "checkbox":
          _.forEach(
            FollowAnalyticsParams.questions.options,
            (option, optionIndex) => {
              let checkboxContainer = $(
                '<div class="question_checkbox">' +
                  '<input type="checkbox" name="question' +
                  index +
                  '" id="question' +
                  index +
                  "_" +
                  optionIndex +
                  '" value="" />' +
                  '<label for="question' +
                  index +
                  "_" +
                  optionIndex +
                  '" class="question_checkbox_label">' +
                  option.text +
                  "</label>" +
                  "</div>"
              );
              questionBody.append(checkboxContainer);
            }
          );
          break;
        case "radio":
          _.forEach(
            FollowAnalyticsParams.questions.options,
            (option, optionIndex) => {
              let radioContainer = $(
                '<div class="question_radio">' +
                  '<input type="radio" name="question' +
                  index +
                  '" id="question' +
                  index +
                  "_" +
                  optionIndex +
                  '" value="' +
                  option.text +
                  '" />' +
                  '<label for="question' +
                  index +
                  "_" +
                  optionIndex +
                  '" class="question_radio_label">' +
                  option.text +
                  "</label>" +
                  "</div>"
              );
              questionBody.append(radioContainer);
              questionBody.append(yesContainer);
              questionBody.append(noContainer);
            }
          );
          break;
        case "textarea":
          let textareaContainer = $(
            '<textarea class="question_textarea question_input"' +
              ' name="question' +
              index +
              '" placeholder="' +
              general_params.textarea_placeholder +
              '" maxlength="700">' +
              "</textarea>"
          );
          questionBody.append(textareaContainer);
          break;
      }

      const nextBtnContainer = $(
        '<div class="submit_btn__wrapper"><input type="submit"' +
          'data-qid="' +
          index +
          '"' +
          'data-qtype="' +
          element.question.type +
          '"' +
          ' value="' +
          general_params.next_button_text +
          '" class="submit_btn" style="background-color: ' +
          general_params.next_button_color +
          ';" /></div>'
      );

      questionBody.append(nextBtnContainer);

      questionWrapper.append(questionTitle);
      questionWrapper.append(questionBody);

      questionContainer.append(questionLabel);
      questionContainer.append(questionWrapper);

      pageContainer.append(questionContainer);

      templateContainer.append(pageContainer);
    });

    /*--------------------------END OF QUESTION PAGE--------------------------*/
    /*--------------------------FINISH PAGE--------------------------*/

    let end_params = FollowAnalyticsParams.end_params;

    const endPageContainer = $('<div class="pageContainer" />');
    const goodbyePage = $('<div class="message__wrapper" />');

    const goodbyeTextContainer = $('<div class="message_text__wrapper" />');
    const goodbyeTitle = $('<p class="message_title" />');
    goodbyeTitle.text(end_params.goodbye_title);
    goodbyeTitle.css({
      fontSize: general_params.font_size_title,
      color: general_params.font_color_title,
    });
    const goodbyeText = $('<p class="message_text" />');
    goodbyeText.text(end_params.goodbye_text);
    goodbyeText.css({
      fontSize: general_params.font_size_body,
      color: general_params.font_color_body,
    });
    goodbyeTextContainer.append(goodbyeTitle);
    goodbyeTextContainer.append(goodbyeText);

    goodbyePage.append(imageContainer);
    goodbyePage.append(goodbyeTextContainer);

    const goodbyeInputContainer = $('<div class="message_input__wrapper" />');
    const goodbyeInputName = $(
      '<input type="text" id="name" name="name" placeholder="' +
        FollowAnalyticsParams.goodbye_inputs.placeholder_name +
        '" class="message_input question_input" />'
    );
    const goodbyeInputPhone = $(
      '<input type="text" id="phone" name="phone" placeholder="' +
        FollowAnalyticsParams.goodbye_inputs.placeholder_phone +
        '" class="message_input question_input" />'
    );
    goodbyeInputContainer.append(goodbyeInputName);
    goodbyeInputContainer.append(goodbyeInputPhone);
    goodbyePage.append(goodbyeInputContainer);

    const goodbyeButtonContainer = $('<div class="submit_btn__wrapper" />');
    const goodbyeButton = $(
      '<button class="submit_btn">' +
        end_params.goodbye_button_text +
        "</button>"
    );
    goodbyeButtonContainer.append(goodbyeButton);
    goodbyePage.append(goodbyeButtonContainer);

    const goodbyeWarningBlockContainer = $(
      '<div class="warning_block__wrapper" />'
    );
    const goodbyeWarningText = $('<p class="warning_block" />');
    goodbyeWarningText.text(end_params.warning_text);
    goodbyeWarningBlockContainer.append(goodbyeWarningText);
    goodbyePage.append(goodbyeWarningBlockContainer);
    endPageContainer.append(goodbyePage);
    templateContainer.append(endPageContainer);
    /*--------------------------END OF FINISH PAGE--------------------------*/
    setActivePage(currentPage);
  } catch (e) {
    handleConsoleMessage(e);
  }
});
