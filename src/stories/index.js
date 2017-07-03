import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';

const load = requireContext => requireContext.keys().map(requireContext)

// load all pages
load(require.context('./pages', true, /.index.js$/))
// load all components
load(require.context('./components', true, /.index.js$/))


