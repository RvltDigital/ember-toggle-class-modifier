import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

class SelectboxComponent extends Component {
  @tracked selected;

  constructor() {
    super(...arguments);
    this.selected =
      this.args.options.find(({ value }) => value == this.args.default) ??
      this.args.default;
  }
}

export default SelectboxComponent;
