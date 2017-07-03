
import { storiesOf } from '@storybook/vue';

import Welcome from './Welcome.vue';

storiesOf('Welcome', module).add('Welcome', () => ({
  render: h => h(Welcome),
}));