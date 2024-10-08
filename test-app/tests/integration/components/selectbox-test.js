import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | selectbox', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Selectbox />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Selectbox>
        template block text
      </Selectbox>
    `);

    assert.dom().hasText('template block text');
  });
});
