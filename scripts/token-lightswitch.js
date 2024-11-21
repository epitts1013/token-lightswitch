export class TokenLightswitch {
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
        "light.color": 13236986,
        "light.alpha": 0.3
      },
      torch: {

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

    static initialize() {
      this.log(false, 'Module Initialized!')
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