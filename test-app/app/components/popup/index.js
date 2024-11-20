import Component from '@glimmer/component';
import { scheduleTask } from 'ember-lifeline';
import { guidFor } from '@ember/object/internals';

class PopupComponent extends Component {
  constructor() {
    super(...arguments);
    this.popupId = `popup-${guidFor(this)}`;
    scheduleTask(this, 'destroy', () => {
      document
        .getElementById('popups')
        .insertBefore(document.getElementById(this.popupId), null);
    });
  }

  close() {
    console.log('Popup is saying goodbye.');
  }

  willDestroy() {
    super.willDestroy(...arguments);
    const popup = document.getElementById(this.popupId);
    popup.parentNode.removeChild(popup);
  }
}

export default PopupComponent;
