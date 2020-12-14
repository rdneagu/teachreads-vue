/* TODO:
 * - Remove from wishlist
 * - Remove from read history
 * - Add topic to interests
 * - Remove topic from interests
 * - User page with history, wishlist (as tabs) and topics interested in (as sidebar) and at the bottom top 5 rated books based on interests
 * - Search filters <most difficult>
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App).use(store).use(router).mount('#app');