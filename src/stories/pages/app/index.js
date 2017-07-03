
import { storiesOf } from '@storybook/vue';

import App from '../../../App.vue';

storiesOf('App', module).add('Welcome', () => ({
  render: h => h(App),
}));