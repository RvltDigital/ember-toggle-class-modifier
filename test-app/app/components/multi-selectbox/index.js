import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { removeClasses } from 'ember-toggle-class-modifier';

class MultiSelectbox extends Component {
  @tracked selected = [];

  get options() {
    return this.args.options.filter(
      (option) => !this.selected.includes(option),
    );
  }

  get value() {
    return this.selected.join(',');
  }

  constructor() {
    super(...arguments);
    this.guid = guidFor(this);
    if (!Array.isArray(this.args.default)) {
      return;
    }
    this.selected = this.args.default.filter((option) =>
      this.args.options.includes(option),
    );
  }

  @action
  toggle() {
    return this.options.length > 0;
  }

  @action
  onAdd(option) {
    if (this.selected.includes(option)) {
      return;
    }
    this.selected = [...this.selected, option];
    if (this.options.length > 0) {
      return;
    }
    removeClasses(document.getElementById(this.guid), 'is-opened');
  }

  @action
  onRemove(option, event) {
    event.stopPropagation();
    if (!this.selected.includes(option)) {
      return;
    }
    this.selected = this.selected.filter((_option) => _option !== option);
  }
}

export default MultiSelectbox;
