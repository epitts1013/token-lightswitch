class TokenLightswitch {
    static ID = 'token-lightswitch';

    static FLAGS = {
      LIGHT_TYPE: 'light-type'
    }

    static SETTINGS = {
      SHOW_BUTTONS: 'show-buttons'
    }

    static CONSTANTS = {
      TOGGLE_LIGHT: 'toggle-light',
      LIGHT_CANTRIP: 'light-cantrip',
      TORCH: 'torch'
    }

    static LIGHT_DATA = {
      lightCantrip: {
        "light.dim": 40, 
        "light.bright": 20,
        "light.animation.type": "pulse",
        "light.animation.intensity": 2,
        "light.color": Color.fromString('#5b7171'),
        "light.alpha": 0.7
      },
      torch: {
        "light.dim": 40, 
        "light.bright": 20,
        "light.animation.type": "flame",
        "light.animation.intensity": 3,
        "light.color": Color.fromString('#a2642a'),
        "light.alpha": 0.7
      },
      off: {
        "light.dim": 0, 
        "light.bright": 0,
        "light.animation.type": null,
        "light.animation.intensity": 5,
        "light.color": null,
        "light.alpha": 0.5
      }
    }

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

        case undefined:
          await tokenDocument.update(this.LIGHT_DATA.off);
          break;
      
        default:
          this.log(false, 'Error in setTokenLight, invalid light type');
          return;
      }
    }
}

Hooks.on('renderTokenHUD', (hud, html) => {
  const lightsColumnDiv = $('<div class="col very-left"></div>');

  const currentLightType = hud.object.document.getFlag(TokenLightswitch.ID, TokenLightswitch.FLAGS.LIGHT_TYPE);

  const lightSpellButton = `
    <div 
      class="control-icon ${currentLightType === TokenLightswitch.CONSTANTS.LIGHT_CANTRIP ? 'light-active' : ''}" 
      data-action="${TokenLightswitch.CONSTANTS.TOGGLE_LIGHT}" 
      data-tooltip="TOKEN-LIGHTSWITCH.HUD.tooltips.light-spell"
      data-light-type="${TokenLightswitch.CONSTANTS.LIGHT_CANTRIP}"
    >
      <i class="fa-regular fa-brightness"></i>
    </div>`;

  const torchButton = `
    <div 
      class="control-icon ${currentLightType === TokenLightswitch.CONSTANTS.TORCH ? 'light-active' : ''}" 
      data-action="${TokenLightswitch.CONSTANTS.TOGGLE_LIGHT}" 
      data-tooltip="TOKEN-LIGHTSWITCH.HUD.tooltips.torch"
      data-light-type="${TokenLightswitch.CONSTANTS.TORCH}"
    >
      <i class="fa-regular fa-fire"></i>
    </div>`;

  lightsColumnDiv.append(lightSpellButton);
  lightsColumnDiv.append(torchButton);

  html.prepend(lightsColumnDiv);

  html.on('click', '.control-icon', async (event) => {
    const eventTarget = $(event.currentTarget);
    const data = eventTarget?.data();
    
    if (data?.action !== TokenLightswitch.CONSTANTS.TOGGLE_LIGHT) return;

    const currentLightType = hud.object.document.getFlag(TokenLightswitch.ID, TokenLightswitch.FLAGS.LIGHT_TYPE);
    
    switch (data?.lightType) {
      case TokenLightswitch.CONSTANTS.LIGHT_CANTRIP:
        if (currentLightType !== TokenLightswitch.CONSTANTS.LIGHT_CANTRIP) {
          hud.object.document.setFlag(TokenLightswitch.ID, TokenLightswitch.FLAGS.LIGHT_TYPE, 
            TokenLightswitch.CONSTANTS.LIGHT_CANTRIP);
          
          await TokenLightswitch.setTokenLight(hud.object.document, 
            TokenLightswitch.CONSTANTS.LIGHT_CANTRIP);
        } else {
          hud.object.document.unsetFlag(TokenLightswitch.ID, TokenLightswitch.FLAGS.LIGHT_TYPE);
          await TokenLightswitch.setTokenLight(hud.object.document, undefined);
        }
        break;

      case TokenLightswitch.CONSTANTS.TORCH:
        if (currentLightType !== TokenLightswitch.CONSTANTS.TORCH) {
          hud.object.document.setFlag(TokenLightswitch.ID, TokenLightswitch.FLAGS.LIGHT_TYPE, 
            TokenLightswitch.CONSTANTS.TORCH);

          await TokenLightswitch.setTokenLight(hud.object.document, 
            TokenLightswitch.CONSTANTS.TORCH);
        } else {
          hud.object.document.unsetFlag(TokenLightswitch.ID, TokenLightswitch.FLAGS.LIGHT_TYPE);
          await TokenLightswitch.setTokenLight(hud.object.document, undefined);
        }
        break;
    
      default:
        TokenLightswitch.log(false, 'Error in click handler, undefined light type');
        return;
    }

    hud.render();
  });
});