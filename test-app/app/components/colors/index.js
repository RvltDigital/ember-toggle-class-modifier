import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { removeClasses } from 'ember-toggle-class-modifier';

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
      removeClasses(
        document.getElementById(this.guid),
        `colors--${this.color}`,
      );
    }
    this.color = event.target.value;
  }
}

export default ColorsComponent;
