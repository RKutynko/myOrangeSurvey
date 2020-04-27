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

const CURRENT_PAGE_KEY = "currentPage";
let currentPage = 0;
let lastPage = 0;

const setActivePage = (index) => {
  const templateContainer = $(".multiFullcreenTemplate");

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

const setUpSwipeCallbacks = (swipeManager) => {
  swipeManager.onLeft(() => {
    if (currentPage < lastPage) {
      setActivePage(++currentPage);
    }
  });
  swipeManager.onRight(() => {
    if (currentPage > 0) {
      setActivePage(--currentPage);
    }
  });
  swipeManager.run();
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

    const templateContainer = $(".multiFullcreenTemplate");

    /*------------------------------------------------------------------------------------------
      MY CONFIGS
      -------------------------------------------------------------------------------------------*/

      //Greeting Configs
      let params = FollowAnalyticsParams.global_params;

      const greetingPage = $('<div class="message__wrapper" />');
      //TODO изменить на бэкграунд, а не имадж срк
      const greetingAvatarContainer = $(
        '<div class="message_avatar__wrapper" />'
      );
      const greetingAvatar = $('<img class="message_avatar" />');
      greetingAvatarContainer.append(greetingAvatar);

      const greetingTextContainer = $('<div class="message_text__wrapper" />');
      const greetingTitle = $('<p class="message_title" />');
      greetingTitle.text(params.greeting_title.text);
      const greetingText = $('<p class="message_text" />');
      greetingText.text(params.greeting_text.text);
      greetingTextContainer.append(greetingTitle);
      greetingTextContainer.append(greetingText);

      const greetingButtonContainer = $('<div class="submit_btn__wrapper" />');
      const greetingButton = $(
        '<button class="submit_btn">' + params.button_text.text + "</button>"
      );
      greetingButtonContainer.append(greetingButton);

      greetingPage.append(greetingAvatarContainer);
      greetingPage.append(greetingTextContainer);
      greetingPage.append(greetingButtonContainer);

      //Goodbye Configs
      const goodbyePage = $('<div class="message__wrapper" />');

      const goodbyeTextContainer = $('<div class="message_text__wrapper" />');
      const goodbyeTitle = $('<p class="message_title" />');
      goodbyeTitle.text(params.goodbye_title.text);
      const goodbyeText = $('<p class="message_text" />');
      goodbyeText.text(params.goodbye_text.text);
      goodbyeTextContainer.append(goodbyeTitle);
      goodbyeTextContainer.append(goodbyeText);

      greetingAvatarContainer.append(greetingAvatar);

      goodbyePage.append(greetingAvatarContainer);
      goodbyePage.append(goodbyeTextContainer);      
      
      //Add inputs on final page
      if(params.is_enable_goodbye_form.is_enable.text) {        
        const goodbyeInputContainer = $('<div class="message_input__wrapper" />');

        _.forEach(params.is_enable_goodbye_form.inputs, (input) => {
          const goodbyeInput = $(
            '<input type="text" id="' + input.name.text
           + '" name="'+ input.name.text
           +'" placeholder="' + input.placeholder.text
           + '" class="message_input question_input" />'
           );
           goodbyeInputContainer.append(goodbyeInput);
        });      
         goodbyePage.append(goodbyeInputContainer);
      }



      //Question Configs
      const questionPage = $('<div class="question__wrapper" />');
      //TODO Добавить  Question 1/3 счетчик вопросов
      const questionLabel = $('<p class="question_label">Question ' + '</p>');
      const questionTitle = $('<p class="question_title" />');


    // Page configs
    lastPage = _.size(FollowAnalyticsParams.pages) - 1;
    _.forEach(FollowAnalyticsParams.pages, (page, index) => {
      const pageContainer = $(
        `<div id="page-${index}" class="pageContainer" />`
      );
      const swipeManager = new SwipeManager(pageContainer);
      setUpSwipeCallbacks(swipeManager);

      // Background configs
      const pageHtml = $('<div class="page" />');
      const pageContent = $('<div class="page__contents" />');
      pageHtml.append(pageContent);
      /*pageHtml.css({
        backgroundColor: page.background.color,
        backgroundImage: `url(${page.background.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      });*/

      // Close button configs
      const closeButtonHtml = $('<div class="closeButton">');
      closeButtonHtml.html(Assets.icoClose);
      closeButtonHtml.find("svg").css({ fill: page.close_button.color });
      closeButtonHtml.on("click", () => {
        if (FollowAnalytics.CurrentCampaign.logAction) {
          FollowAnalytics.CurrentCampaign.logAction(
            `Page ${index + 1} - Dismiss`
          );
        }
        FollowAnalytics.CurrentCampaign.close();
        $("#popupTemplate").removeClass("backdrop");
      });

      // Uploaded image configs
      if (!!page.image.upload) {
        const imageHtml = $('<div class="page__image" />');
        imageHtml.css({
          backgroundImage: `url(${page.image.upload})`,
          display: "flex",
        });
        pageContent.append(imageHtml);
      }


      // Body text configs
      const bodyContainer = $('<div class="page__body" />');
      const bodyHtml = $("<span />");
      const newlineRegex = /(?:\r\n|\r|\n)/g;
      bodyHtml.html(escapeHtml(page.body.text).replace(newlineRegex, "<br>"));
      bodyHtml.css({
        fontSize: `${page.body.size}px`,
        color: page.body.color,
      });
      bodyContainer.append(bodyHtml);
      pageContent.append(bodyContainer);

      const buttonsContainer = $('<div class="page__buttons buttonGrid" />');
      _.forEach(page.buttons, (btn) => {
        const buttonWrapper = $('<div class="buttonCell"></div>');
        const buttonHtml = $(`<div class="actionButton">${btn.text}</div>`);
        buttonHtml.css({
          backgroundColor: btn.background,
          color: btn.font_color,
          fontSize: `${btn.font_size}px`,
        });

        buttonHtml.on("click", (_event) => {
          if (FollowAnalytics.CurrentCampaign.logAction) {
            FollowAnalytics.CurrentCampaign.logAction(
              `Page ${index + 1} - ${btn.text}`
            );
          }
          if (btn.deeplink_url !== "") {
            if (FollowAnalyticsWrapper.checkMinSdkVersion(6, 3, 0)) {
              window.location.href = btn.deeplink_url;
            } else {
              const deeplinkIframe = $(`
                <iframe
                  src="${btn.deeplink_url}"
                  class="deeplinkFrame"
                  sandbox="allow-same-origin allow-scripts"
                  frameborder="0">
                </iframe>
              `);
              deeplinkIframe.on("load", () => {
                deeplinkIframe.css({ opacity: 1 });
                $("body").prepend(closeButtonHtml);
              });
              $("body").prepend(deeplinkIframe);
            }
          } else {
            FollowAnalytics.CurrentCampaign.close();
            $("#popupTemplate").removeClass("backdrop");
          }
        });

        buttonWrapper.append(buttonHtml);
        buttonsContainer.append(buttonWrapper);
      });
      pageContent.append(buttonsContainer);

      pageContainer.append(closeButtonHtml);
      pageContainer.append(pageHtml);
      templateContainer.append(pageContainer);
    });

    setActivePage(currentPage);
  } catch (e) {
    handleConsoleMessage(e);
  }
});
