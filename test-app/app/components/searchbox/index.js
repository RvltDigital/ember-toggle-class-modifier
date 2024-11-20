import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { EVENT_SOURCE_TYPE } from 'ember-toggle-class-modifier';

class Searchbox extends Component {
  @tracked term = '';

  @action
  toggle(event, type) {
    if (type !== EVENT_SOURCE_TYPE.OUTSIDE) {
      return true;
    }
    if (this.term.trim() !== '') {
      return false;
    }
    this.term = '';
    return true;
  }
}

export default Searchbox;
