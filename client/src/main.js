/* TODO:
 * - Add dropdown to quick search bar with possible search filters
 * - Add search filters to the filter bar such as filtering by: category, average review, title + description, author
 * - Add ordering to the filter for ordering by: name, category, rating, amount of reviews, amount of wished for, most read
 */

import { createApp } from 'vue';
import { VueCookieNext } from 'vue-cookie-next';
import VueApexCharts from 'vue3-apexcharts';

import { tooltipDirective } from '@/directives/_index';

import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
  .use(store)
  .use(router)
  .use(VueCookieNext)
  .use(VueApexCharts)
  .directive('tooltip', tooltipDirective)
  .mount('#app');
