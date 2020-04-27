import $ from "jquery";
import _ from "lodash";
import "./css/style.css";
import Assets from "./assets/assets";
import SwipeManager from "./lib/swiper";
import {
  escapeHtml,
  getIconDimensions,
  hexToRgb,
  handleConsoleMessage,
} from "./lib/utils";
import { FollowAnalyticsWrapper } from "./lib/FollowAnalyticsWrapper";

$(window).on("load", () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    const templateContainer = $(".multiFullcreenTemplate");

    /*------------------------------------------------------------------------------------------
      MY CONFIGS
      -------------------------------------------------------------------------------------------*/

    let params = FollowAnalyticsParams.global_params;

    /*--------------------------START PAGE--------------------------*/
    const greetingPage = $('<div class="message__wrapper" />');

    //handling image
    const imageContainer = $('<div class="message_avatar__wrapper" />');
    if (!!params.image) {
      const image = $('<div class="message_avatar" />');
      image.css({
        backgroundImage: `url(${params.image})`,
      });
    }
    imageContainer.append(image);

    const greetingTextContainer = $('<div class="message_text__wrapper" />');
    const greetingTitle = $('<p class="message_title" />');
    greetingTitle.text(params.greeting_title);
    const greetingText = $('<p class="message_text" />');
    greetingText.text(params.greeting_text);
    greetingTextContainer.append(greetingTitle);
    greetingTextContainer.append(greetingText);

    const greetingButtonContainer = $('<div class="submit_btn__wrapper" />');
    const greetingButton = $(
      '<button class="submit_btn">' + params.button_text + "</button>"
    );
    greetingButtonContainer.append(greetingButton);

    greetingPage.append(imageContainer);
    greetingPage.append(greetingTextContainer);
    greetingPage.append(greetingButtonContainer);
    /*--------------------------END OF START PAGE--------------------------*/

    /*--------------------------FINISH PAGE--------------------------*/
    const goodbyePage = $('<div class="message__wrapper" />');

    const goodbyeTextContainer = $('<div class="message_text__wrapper" />');
    const goodbyeTitle = $('<p class="message_title" />');
    goodbyeTitle.text(params.goodbye_title);
    const goodbyeText = $('<p class="message_text" />');
    goodbyeText.text(params.goodbye_text);
    goodbyeTextContainer.append(goodbyeTitle);
    goodbyeTextContainer.append(goodbyeText);

    goodbyePage.append(imageContainer);
    goodbyePage.append(goodbyeTextContainer);

    //Add inputs on final page
    if (params.is_enable_goodbye_form.is_enable) {
      const goodbyeInputContainer = $('<div class="message_input__wrapper" />');

      _.forEach(FollowAnalyticsParams.goodbye_inputs, (input) => {
        const goodbyeInput = $(
          '<input type="text" id="' +
            input.name +
            '" name="' +
            input.name +
            '" placeholder="' +
            input.placeholder +
            '" class="message_input question_input" />'
        );
        goodbyeInputContainer.append(goodbyeInput);
      });
      goodbyePage.append(goodbyeInputContainer);
      const goodbyeButtonContainer = $('<div class="submit_btn__wrapper" />');
      const goodbyeButton = $(
        '<button class="submit_btn">Répondre au sondage</button>'
      );
      goodbyeButtonContainer.append(goodbyeButton);
      goodbyePage.append(goodbyeButtonContainer);
    }

    const goodbyeWarningBlockContainer = $(
      '<div class="warning_block__wrapper" />'
    );
    const goodbyeWarningText = $('<p class="warning_block" />');
    goodbyeWarningText.text(params.warning_text);
    goodbyeWarningBlockContainer.append(goodbyeWarningText);
    goodbyePage.append(goodbyeWarningBlockContainer);
    /*--------------------------END OF FINISH PAGE--------------------------*/

    /*--------------------------QUESTION PAGE--------------------------*/
    _.forEach(FollowAnalyticsParams.questions, (element, index) => {
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
      const questionBody = $('<div id="questionBody" />');
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
                  '" value="" />' +
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
            }
          );
          break;
        case "textarea":
          let textareaContainer = $(
            '<textarea class="question_textarea question_input"' +
              ' name="question' +
              index +
              '" placeholder="Saisissez ici votre réponse." maxlength="700">' +
              "</textarea>"
          );
          questionBody.append(textareaContainer);
          break;
        case "rating":
          break;
        case "range":
          break;
      }
    });

    /*--------------------------END OF QUESTION PAGE--------------------------*/

    //Question Configs
    const questionPage = $('<div class="question__wrapper" />');
    //TODO Добавить  Question 1/3 счетчик вопросов
    const questionLabel = $('<p class="question_label">Question ' + "</p>");
    const questionTitle = $('<p class="question_title" />');
  } catch (e) {
    handleConsoleMessage(e);
  }
});
