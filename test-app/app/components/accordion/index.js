import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { EVENT_SOURCE_TYPE } from 'ember-toggle-class-modifier';

class AccordionComponent extends Component {
  constructor() {
    super(...arguments);
    this.guid = guidFor(this);
  }

  @action
  toggleClick(event, type) {
    if (type !== EVENT_SOURCE_TYPE.OUTSIDE) {
      return;
    }
    return event.target.closest(`#${this.guid}`) !== null;
  }

  @action
  toggleMouseover(event) {
    return event.target.closest(`#${this.guid}`) === null;
  }
}

export default AccordionComponent;
