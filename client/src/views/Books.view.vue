<template>
  <div class="books-vue">
    <section class="sidebar" />
    <section class="main">
      <Book v-for="book in books" :key="book.id" :book="book" />
    </section>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util';

import Book from '@/components/Book.component';

export default {
  name: 'BooksView',
  components: { Book },
  data() {
    return {
      books: [],
    };
  },

  async mounted() {
    this.books = await invokeAPI('/api/books');
  },
};
</script>

<style lang="scss" scoped>
.view.books-vue {
  .sidebar {
    position: fixed;
    width: 300px;
    top: 83px; bottom: 33px;
    border-radius: 0 4px 4px 0;
    background-color: rgba(darken($old-lavender, 25%), .9);
    box-shadow: 2px 0 15px rgba(#000, .8);
  }
  .main {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 225px));
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    justify-content: space-evenly;
    justify-items: center;
    margin-left: 300px;
    padding: 0 20px 35px 20px;
  }
}
</style>
