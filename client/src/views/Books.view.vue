<template>
  <div class="books-vue">
    <section class="sidebar" />
    <section class="main">
      <Error v-if="!books.length && !pending">We could not find any books!</Error>
      <Book v-else v-for="book in books" :key="book.id" :book="book" />
    </section>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util';

import Book from '@/components/Book.component';
import Error from '@/components/Error.component';

export default {
  name: 'BooksView',
  components: { Book, Error },
  data() {
    return {
      books: [],
      pending: true,
    };
  },

  async mounted() {
    this.findBooks(this.$route.query);
  },

  methods: {
    async findBooks(query = {}) {
      this.pending = true;
      this.books = [];
      try {
        if (!query.search) {
          this.books = await invokeAPI('/api/books');
        } else {
          const params = {
            search: {
              title: query.search,
              description: query.search,
            },
          };
          if (query.filter && query.filter !== 'auto') {
            params.search = {
              [query.filter]: query.search,
            };
          }
          this.books = await invokeAPI('/api/books/search', { params });
        }
      } catch (err) { /* */ }
      this.pending = false;
    },
  },

  watch: {
    '$route.query': {
      deep: true,
      async handler(next) {
        await this.findBooks(next);
      },
    },
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
    position: relative;
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, 240px);
    grid-template-rows: repeat(auto-fit, minmax(0px, min-content));
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    justify-content: space-evenly;
    justify-items: center;
    padding: 0 20px 35px 20px;
    margin-left: 300px;
  }
}
</style>
