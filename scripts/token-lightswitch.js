class TokenLightswitch {
  static ID = "token-lightswitch";

  static FLAGS = {
    LIGHT_TYPE: "light-type",
  };

  static SETTINGS = {
    SHOW_BUTTONS: "show-buttons",
  };

  static CONSTANTS = {
    TOGGLE_LIGHT: "toggle-light",
    LIGHT_CANTRIP: "light-cantrip",
    TORCH: "torch",
    OFF: "off",
  };

  static LIGHT_DATA = {
    lightCantrip: {
      "light.dim": 40,
      "light.bright": 20,
      "light.animation.type": "pulse",
      "light.animation.intensity": 2,
      "light.color": Color.fromString("#5b7171"),
      "light.alpha": 0.7,
    },
    torch: {
      "light.dim": 40,
      "light.bright": 20,
      "light.animation.type": "flame",
      "light.animation.intensity": 3,
      "light.color": Color.fromString("#a2642a"),
      "light.alpha": 0.7,
    },
    off: {
      "light.dim": 0,
      "light.bright": 0,
      "light.animation.type": null,
      "light.animation.intensity": 5,
      "light.color": null,
      "light.alpha": 0.5,
    },
  };

  static log(force, ...args) {
    console.log(this.ID, "|", ...args);
  }

  static async setTokenLight(tokenDocument, lightType) {
    switch (lightType) {
      case this.CONSTANTS.LIGHT_CANTRIP:
        await tokenDocument.update(this.LIGHT_DATA.lightCantrip);
        break;

      case this.CONSTANTS.TORCH:
        await tokenDocument.update(this.LIGHT_DATA.torch);
        break;

      case this.CONSTANTS.OFF:
      case undefined:
        await tokenDocument.update(this.LIGHT_DATA.off);
        break;

      default:
        this.log(false, "Error in setTokenLight, invalid light type");
        return;
    }
  }
}

Hooks.on("renderTokenHUD", (hud, html) => {
  const lightsColumnDiv = $('<div class="col very-left"></div>');

  const currentLightType = hud.object.document.getFlag(
    TokenLightswitch.ID,
    TokenLightswitch.FLAGS.LIGHT_TYPE
  );

  lightsColumnDiv.append(`
    <div 
      class="control-icon ${
        currentLightType === TokenLightswitch.CONSTANTS.LIGHT_CANTRIP
          ? 'light-active'
          : ''
      }" 
      data-action="${TokenLightswitch.CONSTANTS.TOGGLE_LIGHT}" 
      data-tooltip="TOKEN-LIGHTSWITCH.HUD.tooltips.light-spell"
      data-light-type="${TokenLightswitch.CONSTANTS.LIGHT_CANTRIP}"
      id="${TokenLightswitch.CONSTANTS.LIGHT_CANTRIP}"
    >
      <i class="fa-regular fa-brightness"></i>
    </div>
  `);

  lightsColumnDiv.append(`
    <div 
      class="control-icon ${
        currentLightType === TokenLightswitch.CONSTANTS.TORCH
          ? 'light-active'
          : ''
      }" 
      data-action="${TokenLightswitch.CONSTANTS.TOGGLE_LIGHT}" 
      data-tooltip="TOKEN-LIGHTSWITCH.HUD.tooltips.torch"
      data-light-type="${TokenLightswitch.CONSTANTS.TORCH}"
      id="${TokenLightswitch.CONSTANTS.TORCH}"
    >
      <i class="fa-regular fa-fire"></i>
    </div>
  `);

  html.prepend(lightsColumnDiv);

  html.on("click", ".control-icon", async (event) => {
    const eventTarget = $(event.currentTarget);
    const data = eventTarget?.data();

    if (data?.action !== TokenLightswitch.CONSTANTS.TOGGLE_LIGHT) return;

    const newLightType = data?.lightType;

    if (currentLightType === newLightType) {
      hud.object.document.unsetFlag(
        TokenLightswitch.ID,
        TokenLightswitch.FLAGS.LIGHT_TYPE
      );
      await TokenLightswitch.setTokenLight(
        hud.object.document,
        TokenLightswitch.CONSTANTS.OFF
      );
      html.find(".light-active").removeClass("light-active");
      return;
    }

    hud.object.document.setFlag(
      TokenLightswitch.ID,
      TokenLightswitch.FLAGS.LIGHT_TYPE,
      newLightType
    );
    await TokenLightswitch.setTokenLight(hud.object.document, newLightType);
    html.find(".light-active").removeClass("light-active");
    html.find(`#${newLightType}`).addClass("light-active");
  });
});

// Hooks.on('preUpdateToken', (document, changed) => {
//   // TODO: Figure out a way to deactivate light controls if lighting is changed manually
//   // Note:
//   // - foundry.utils.diffObject
//   // - foundry.utils.filterObject
//   // - foundry.utils.objectEquals
// });
