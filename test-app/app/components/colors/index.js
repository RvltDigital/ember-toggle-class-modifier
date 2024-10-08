import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class ColorsComponent extends Component {
  @tracked color = null;
  @tracked mainElement;

  constructor() {
    super(...arguments);
    this.guid = guidFor(this);
  }

  @action
  onToggle(event) {
    if (this.color !== null) {
      document
        .getElementById(this.guid)
        .classList.remove(`colors--${this.color}`);
    }
    this.color = event.target.value;
  }
}

export default ColorsComponent;
