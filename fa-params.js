//
// Warning: This file will be replaced upon uploading to the server.
// It is only useful for offline development. Please do not add anything
// except test values for the parameters here.
//
//TODO переделать
FollowAnalyticsParams = {
  global_params: {
    font_size: "",
    font_color: "#000000",
    image: "./assets/images/Avatar.png",
    next_button_text: "Suivant",
    next_button_color: "#F16E00",
    textarea_placeholder: "Saisissez ici votre réponse.",
  },
  start_params: {
    greeting_title: "Merci d’avoir utilisé Orange et moi !",
    greeting_text:
      " Afin de faire évoluer notre application pour qu’elle réponde à tous vos besoins nous souhaiterions recueillir votre avis.",
    greeting_button_text: "Répondre au sondage",
  },
  end_params: {
    goodbye_title: "Merci !",
    goodbye_text:
      "Votre avis est très important pour nous, souhaitez-vous que nos équipes vous recontactent ?",
    goodbye_button_text: "Répondre au sondage",
    warning_text:
      "Mentions légales lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  goodbye_inputs: {
    placeholder_name: "Prénom Nom",
    placeholder_phone: "Numéro de mobile",
  },
  questions: [
    {
      text: "Pouvez-vous nous préciser le ou les motif(s) de votre visite ?",
      type: "checkbox",
      options: [
        {
          text: "Suivre ma consommation",
        },
        {
          text: "Payez vos factures ou Recharger du crédit",
        },
        {
          text: "Souscrire, gérer, résilier une option",
        },
        {
          text: "Modifier vos données personnelles / mot de passe",
        },
        {
          text: "Trouver de l'aide ou déposer une réclamation",
        },
        {
          text: "Autres",
        },
      ],
    },
    {
      text: "",
      type: "radio",
      options: [
        {
          text: "Oui",
        },
        {
          text: "Non",
        },
      ],
    },
    {
      text:
        "Merci ! Pouvez-vous nous préciser pour quelles raisons vous recommanderiez Orange ?",
      type: "textarea",
      options: [],
    },
  ],
  feedback_question: {
    text_rating_positive:
      "Comment évaluez-vous la facilité avec laquelle vous avez accompli votre tâche ?",
    text_range_positive:
      "Sur une échelle de 1 à 10, quelle serait la probabilité que vous recommandiez Orange à vos proches ou à vos amis ?",
    text_range_label_from: "Quasi nulle",
    text_range_label_to: "Très probable",
    text_textarea_negative:
      "Nous sommes désolés, pourriez-vous nous dire ce qui n’a pas fonctionné ?",
  },
};
