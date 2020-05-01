//
// Warning: This file will be replaced upon uploading to the server.
// It is only useful for offline development. Please do not add anything
// except test values for the parameters here.
//
//TODO переделать
FollowAnalyticsParams = {
  general_title: {
    size: "18",
    color: "#000000",
  },
  general_body: {
    size: "16",
    color: "#000000",
  },
  general_image: {
    image: "./assets/images/Avatar.png",
  },
  general_next_button: {
    text: "Suivant",
    color: "#F16E00",
  },
  general_params_for_inputs: {
    textarea_placeholder: "Saisissez ici votre réponse.",
    text_range_label_from: "Quasi nulle",
    text_range_label_to: "Très probable",
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
      text:
        "Avez-vous réussi à effectuer la tâche que vous souhaitiez accomplir ?",
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
  ],
  positive_questions: [
    {
      text:
        "Comment évaluez-vous la facilité avec laquelle vous avez accompli votre tâche ?",
      type: "rating",
      options: [],
    },
    {
      text:
        "Sur une échelle de 1 à 10, quelle serait la probabilité que vous recommandiez Orange à vos proches ou à vos amis ?",
      type: "range",
      options: [],
    },
    {
      text:
        "Merci ! Pouvez-vous nous préciser pour quelles raisons vous recommanderiez Orange ?",
      type: "textarea",
      options: [],
    },
  ],
  negative_questions: [
    {
      text:
        "Nous sommes désolés, pourriez-vous nous dire ce qui n’a pas fonctionné ?",
      type: "textarea",
      options: [],
    },
    {
      text:
        "Que devrions-nous faire évoluer pour que vous recommandiez Orange ?",
      type: "textarea",
      options: [],
    },
  ],
};
