import $ from "jquery";
import _ from "lodash";
import "ion-rangeslider";
import "./css/main.css";
import "./css/style.css";
import "./js/range/ion.rangeSlider.min.css";
import "./js/range/ion.rangeSlider.min.js";
import "./js/script.js";
import { handleConsoleMessage } from "./lib/utils";
import { FollowAnalyticsWrapper } from "./lib/FollowAnalyticsWrapper";

const templateContainer = $(".multiFullcreenTemplate");
const CURRENT_PAGE_KEY = "currentPage";
let currentPage = 1;
let lastPage = 0;
let counter = 2;

const setActivePage = (index) => {
  $(".pageContainer").each((_idx, node) => {
    node.removeAttribute("class");
    node.className = "pageContainer";
  });

  for (let i = 0; i <= lastPage; i++) {
    const page = $(`#page-${i}`);
    if (i < index) page.addClass("pageContainer--previous");
    if (i == index) page.addClass("pageContainer--current");
    if (i > index) page.addClass("pageContainer--next");
  }

  currentPage = index;
  if (typeof FollowAnalytics.CurrentCampaign.setData === "function") {
    console.log(`Save page: ${index}`);
    FollowAnalytics.CurrentCampaign.setData(CURRENT_PAGE_KEY, index);
  }
};

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
    lastPage =
      _.size(FollowAnalyticsParams.questions) +
      _.size(FollowAnalyticsParams.positive_questions) +
      _.size(FollowAnalyticsParams.negative_questions) +
      2;

    /*----------------------------GENERAL CONFIGS-----------------------------*/
    //handling image
    const imageContainer = $('<div class="message_avatar__wrapper" />');
    const image = $('<div class="message_avatar" />');
    if (!!FollowAnalyticsParams.general_image.image) {
      image.css({
        backgroundImage: `url(${FollowAnalyticsParams.general_image.image})`,
      });
    }
    imageContainer.append(image);

    /*--------------------------START PAGE--------------------------*/
    let start_params = FollowAnalyticsParams.start_params;
    const startPageContainer = $('<div class="pageContainer" id="page-1" />');
    const greetingPage = $('<div class="message__wrapper" />');

    const greetingTextContainer = $('<div class="message_text__wrapper" />');
    const greetingTitle = $('<p class="message_title" />');
    greetingTitle.text(start_params.greeting_title);
    greetingTitle.css({
      fontSize: FollowAnalyticsParams.general_title.size,
      color: FollowAnalyticsParams.general_title.color,
    });
    const greetingText = $('<p class="message_text" />');
    greetingText.text(start_params.greeting_text);
    greetingText.css({
      fontSize: FollowAnalyticsParams.general_body.size,
      color: FollowAnalyticsParams.general_body.color,
    });
    greetingTextContainer.append(greetingTitle);
    greetingTextContainer.append(greetingText);

    const greetingButtonContainer = $(
      '<div class="submit_btn__wrapper active" />'
    );
    const greetingButton = $(
      '<button class="submit_btn" id="greetingButton">' +
        start_params.greeting_button_text +
        "</button>"
    );
    greetingButton.on("click", (_event) => {
      setActivePage(++currentPage);
    });
    greetingButtonContainer.append(greetingButton);

    greetingPage.append(imageContainer);
    greetingPage.append(greetingTextContainer);
    greetingPage.append(greetingButtonContainer);

    startPageContainer.append(greetingPage);

    templateContainer.append(startPageContainer);

    questionPageGenerator(FollowAnalyticsParams.questions, "");

    let end_params = FollowAnalyticsParams.end_params;

    const endPageContainer = $(
      '<div class="pageContainer" id="page-' + lastPage + '" />'
    );
    const goodbyePage = $('<div class="message__wrapper" />');

    const goodbyeTextContainer = $('<div class="message_text__wrapper" />');
    const goodbyeTitle = $('<p class="message_title" />');
    goodbyeTitle.text(end_params.goodbye_title);
    goodbyeTitle.css({
      fontSize: FollowAnalyticsParams.general_title.size,
      color: FollowAnalyticsParams.general_title.color,
    });
    const goodbyeText = $('<p class="message_text" />');
    goodbyeText.text(end_params.goodbye_text);
    goodbyeText.css({
      fontSize: FollowAnalyticsParams.general_body.size,
      color: FollowAnalyticsParams.general_body.color,
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

    const goodbyeButtonContainer = $(
      '<div class="submit_btn__wrapper active" />'
    );
    const goodbyeButton = $(
      '<button class="submit_btn" id="goodbyeButton">' +
        end_params.goodbye_button_text +
        "</button>"
    );
    goodbyeButton.on("click", (_event) => {
      FollowAnalytics.logEvent("Survey_Analytics", {
        name: $("input#name").val(),
        mobile: $("input#phone").val(),
      });
    });
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

function questionPageGenerator(questions, typeFlow) {
  _.forEach(questions, (element, index) => {
    console.log("typeFlow", typeFlow);
    const pageContainer = $(
      `<div id="page-${counter}" class="pageContainer" data-flow=${typeFlow} />`
    );
    const questionContainer = $('<div class="question__wrapper" />');
    const questionLabel = $(
      //переделать , неправильно выводит
      `<p class="question_label">Question ${counter - 1} / ${lastPage - 2}</p>`
    );
    const questionBlock = $('<div class="" />');
    const questionTitle = $('<p class="question_title" />');
    questionTitle.text(element.question.text);
    const questionBody = $('<div id="questionBody' + index + typeFlow + '" />');

    switch (element.question.type) {
      case "checkbox":
        _.forEach(element.options, (option, optionIndex) => {
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
        });
        break;
      case "radio":
        _.forEach(element.options, (option, optionIndex) => {
          let radioContainer = $('<div class="question_radio" />');
          let radioInput = $(
            '<input type="radio" name="question' +
              index +
              '" id="question' +
              index +
              "_" +
              optionIndex +
              '" value="' +
              optionIndex +
              '" />'
          );
          const radioLabel = $(
            '<label for="question' +
              index +
              "_" +
              optionIndex +
              '" class="question_radio_label">' +
              option.text +
              "</label>"
          );
          // этот странный код - "развилка" для positive и negative flow, также перестраивает структуру шаблона
          radioInput.on("change", (_event) => {
            console.log("click on radio", _event.target.value == 0);
            console.log("lastPage", lastPage);
            // if positive flow
            let newSizePages = lastPage;
            if (_event.target.value == 0) {
              $('.pageContainer[data-flow="B"]').remove();
              newSizePages =
                _.size(FollowAnalyticsParams.questions) +
                _.size(FollowAnalyticsParams.positive_questions) +
                2;
            } else {
              $('.pageContainer[data-flow="A"]').remove();
              newSizePages =
                _.size(FollowAnalyticsParams.questions) +
                _.size(FollowAnalyticsParams.negative_questions) +
                2;
            }
            $(`#page-${lastPage}`).attr("id", `#page-${newSizePages}`);
            lastPage = newSizePages;
            let newPageNumber = 1;
            $(".pageContainer").each(function () {
              $(this).attr("id", `page-${newPageNumber}`);
              newPageNumber++;
            });
            let newQuestionNumber = 1;
            $(".question_label").each(function () {
              $(this).text(`Question ${newQuestionNumber}/${lastPage - 2}`);
              newQuestionNumber++;
            });
          });
          radioContainer.append(radioInput);
          radioContainer.append(radioLabel);
          questionBody.append(radioContainer);
        });
        break;
      case "textarea":
        let textareaContainer = $(
          '<textarea class="question_textarea question_input"' +
            ' name="question' +
            index +
            '" placeholder="' +
            FollowAnalyticsParams.general_params_for_inputs
              .textarea_placeholder +
            '" maxlength="700">' +
            "</textarea>"
        );
        questionBody.append(textareaContainer);
        break;
      case "rating":
        let ratingContainer = $(
          ' <div class="feedback_wrapper emotions_wrapper ">' +
            '<div><input type="radio" name="questionYesEmotions" id="emotions1" value="1" />' +
            '<label for="emotions1" class="emotions_icon emotions_icon__1"></label></div>' +
            '<div><input type="radio" name="questionYesEmotions" id="emotions2" value="2" />' +
            '<label for="emotions2" class="emotions_icon emotions_icon__2"></label></div>' +
            '<div><input type="radio" name="questionYesEmotions" id="emotions3" value="3" />' +
            '<label for="emotions3" class="emotions_icon emotions_icon__3"></label></div>' +
            '<div><input type="radio" name="questionYesEmotions" id="emotions4" value="4" />' +
            '<label for="emotions4" class="emotions_icon emotions_icon__4"></label></div>' +
            '<div><input type="radio" name="questionYesEmotions" id="emotions5" value="5" checked />' +
            '<label for="emotions5" class="emotions_icon emotions_icon__5"></label></div>'
        );
        questionBody.append(ratingContainer);
        break;
      case "range":
        let rangeContainer = $(
          '<div class="feedback_wrapper range_wrapper">' +
            '<div class="question_range__wrapper">' +
            "</div>" +
            '<input type="text" class="js-range-slider question_range"' +
            'name="my_range" value="" />' +
            '<input type="text" value="5" id="questionRangeValue" />' +
            '<div class="question_range_label__wrapper">' +
            '<span class="question_range_label">' +
            FollowAnalyticsParams.general_params_for_inputs
              .text_range_label_from +
            "</span>" +
            '<span class="question_range_label">' +
            FollowAnalyticsParams.general_params_for_inputs
              .text_range_label_to +
            "</span>" +
            "</div>" +
            "</div>"
        );
        questionBody.append(rangeContainer);
        break;
    }

    const nextBtnContainer = $(
      '<div class="submit_btn__wrapper' +
        (element.question.type == "checkbox" || element.question.type == "radio"
          ? ""
          : " active") +
        '"><input type="submit"' +
        ' value="' +
        FollowAnalyticsParams.general_next_button.text +
        '" class="submit_btn" style="background-color: ' +
        FollowAnalyticsParams.general_next_button.color +
        ';" /></div>'
    );

    nextBtnContainer.on("click", (_event) => {
      let key = "Q" + index + typeFlow;
      let log = {};
      switch (element.question.type) {
        case "checkbox":
          let answers = [];
          $(
            "#questionBody" + index + typeFlow + ' input[type="checkbox"]'
          ).each(function () {
            let label = $('label[for="' + $(this).attr("id") + '"]')
              .text()
              .trim();
            if ($(this).is(":checked")) {
              answers.push(label);
            }
          });

          log["question_page"] = key;
          log["answer"] = answers;
          break;
        case "radio":
          $("#questionBody" + index + typeFlow + " .question_radio input").each(
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
          log["answer"] = $(
            "#questionBody" + index + typeFlow + " textarea"
          ).val();
          break;

        case "rating":
          $("#questionBody" + index + typeFlow + ' input[type="radio"]').each(
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
            "#questionBody" + index + typeFlow + " #questionRangeValue"
          ).val();
          break;
      }
      console.log(log);
      FollowAnalytics.logEvent("Survey_Analytics", log);
      setActivePage(++currentPage);
    });

    questionBody.append(nextBtnContainer);

    questionBlock.append(questionTitle);
    questionBlock.append(questionBody);

    questionContainer.append(questionLabel);
    questionContainer.append(questionBlock);

    pageContainer.append(questionContainer);

    templateContainer.append(pageContainer);

    counter++;
    if (element.question.type == "radio") {
      questionPageGenerator(FollowAnalyticsParams.positive_questions, "A");
      questionPageGenerator(FollowAnalyticsParams.negative_questions, "B");
    }
  });
}
