import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.view.vue';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: Home,
  },
  {
    path: '/books',
    name: 'BooksView',
    component: () => import('../views/Books.view.vue'),
  },
  {
    path: '/books/:book',
    name: 'BookView',
    component: () => import('../views/books/Book.view.vue'),
  },
  {
    path: '/about',
    name: 'AboutView',
    component: () => import('../views/About.view.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
