<template>
  <div class="books-vue">
    <section v-if="books.length" class="sidebar">
      <h1 class="sorting-title h1-title">Sort</h1>
      <div class="sorting-wrapper">
        <Button v-bind="buttons.sort" :dropdown="dropdowns.sort" id="btn-sort" />
        <Button v-bind="buttons.sortOrder" :dropdown="dropdowns.sortOrder" id="btn-order" />
        <Button
          v-if="dropdowns.sort.selected"
          name="clear-sort" icon="clear"
          type="menu"
          :click="clearSort"
          v-tooltip="{ text: 'Remove sorting' }" />
      </div>
      <h1 class="filter-title h1-title">Filter</h1>
      <div class="filter-wrapper">
        <div v-for="(category, key) in filters" :key="key" class="filter">
          <div class="filter-title">{{ category.title }}</div>
          <Checkbox
            v-for="checkbox in category.checkboxes"
            :key="checkbox.id"
            v-bind="checkbox"
            :filter="undefined"
            @update:selected="checkbox.selected = $event" />
        </div>
      </div>
    </section>
    <section class="main">
      <Error v-if="!books.length && !pending">We could not find any books!</Error>
      <Book v-else v-for="book in getBooks" :key="book.id" :book="book" />
    </section>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util';

import Button from '@/components/Button.component';
import Book from '@/components/Book.component';
import Checkbox from '@/components/Checkbox.component';
import Error from '@/components/Error.component';

export default {
  name: 'BooksView',
  components: { Button, Book, Checkbox, Error },
  data() {
    return {
      books: [],
      filtered: [],
      pending: true,
      buttons: {
        sort: {
          name: 'result-sort',
          icon: 'arrow_drop_down',
          type: 'inversed menu',
        },
        sortOrder: {
          name: 'result-sort-order',
          icon: 'arrow_drop_down',
          type: 'inversed menu',
        },
      },
      dropdowns: {
        sort: {
          id: 'sort',
          title: 'Sort by',
          items: [
            { text: 'title', type: 'dropdown', sortField: 'title' },
            { text: 'rating', type: 'dropdown', sortField: 'avgRating' },
            { text: 'category', type: 'dropdown', sortField: 'category' },
            { text: 'year', type: 'dropdown', sortField: 'year' },
          ],
        },
        sortOrder: {
          id: 'sort-order',
          title: 'Order',
          items: [
            { text: 'A to Z', type: 'dropdown', default: true },
            { text: 'Z to A', type: 'dropdown' },
          ],
        },
      },
      filters: {
        publisher: { title: 'PUBLISHERS', checkboxes: [] },
        category: { title: 'CATEGORIES', checkboxes: [] },
        rating: { title: 'AVERAGE RATING', checkboxes: [] },
        year: { title: 'YEAR', checkboxes: [] },
        wished: {
          title: 'WISHED',
          checkboxes: [
            { id: 'wished-1', label: 'one or more wished', filter: 'book.nWished > 0' },
            { id: 'wished-2', label: 'no-one wished', filter: '!book.nWished' },
          ],
        },
        read: {
          title: 'READ',
          checkboxes: [
            { id: 'read-1', label: 'one or more read', filter: 'book.nRead > 0' },
            { id: 'read-2', label: 'no-one read', filter: '!book.nRead' },
          ],
        },
        reviews: {
          title: 'REVIEWS',
          checkboxes: [
            { id: 'reviews-1', label: 'one or more reviews', filter: 'book.reviews.length !== 0' },
            { id: 'reviews-2', label: 'no reviews', filter: '!book.reviews.length' },
          ],
        },
      },
    };
  },

  async mounted() {
    this.findBooks(this.$route.query);
  },

  computed: {
    getBooks() {
      let { books } = this;
      if (books.length) {
        const categories = Object.keys(this.filters);
        const pool = categories.reduce((acc = [], category) => {
          const checked = this.filters[category].checkboxes.filter(checkbox => checkbox.selected).map(checkbox => checkbox.filter);
          if (checked.length) {
            acc.push(`(${checked.join(' || ')})`);
          }
          return acc;
        }, []);
        if (pool.length) {
          books = books.filter(book => eval(pool.join(' && '))); // eslint-disable-line
        }

        if (this.dropdowns.sort.selected) {
          const order = this.dropdowns.sortOrder.selected.text || 'A to Z';
          books = books.sort((book1, book2) => {
            const sort1 = book1[this.dropdowns.sort.selected.sortField];
            const sort2 = book2[this.dropdowns.sort.selected.sortField];
            if (order === 'A to Z') {
              return (typeof sort1 === 'number') ? sort2 - sort1 : sort1.localeCompare(sort2);
            }
            return (typeof sort1 === 'number') ? sort1 - sort2 : sort2.localeCompare(sort1);
          });
        } else {
          books = books.sort((book1, book2) => book1.title.localeCompare(book2.title));
        }
      }
      return books;
    },
  },

  methods: {
    clearSort() {
      this.dropdowns.sort.selected = null;
    },
    updateFilters() {
      const books = this.getBooks;
      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        if (this.filters.publisher.checkboxes.findIndex(tmp => tmp.val === book.publisher) === -1) {
          this.filters.publisher.checkboxes.push({
            id: `publisher-${i}`,
            label: book.publisher,
            val: book.publisher,
            filter: `book.publisher === ${JSON.stringify(book.publisher)}`,
          });
        }

        if (this.filters.category.checkboxes.findIndex(tmp => tmp.val === book.category) === -1) {
          this.filters.category.checkboxes.push({
            id: `category-${i}`,
            label: book.category,
            val: book.category,
            filter: `book.category === ${JSON.stringify(book.category)}`,
          });
        }

        const avgRating = Math.floor(book.avgRating);
        if (this.filters.rating.checkboxes.findIndex(tmp => tmp.val === avgRating) === -1) {
          this.filters.rating.checkboxes.push({
            id: `rating-${i}`,
            label: `${avgRating} stars`,
            val: avgRating,
            filter: `Math.floor(book.avgRating) === ${avgRating}`,
          });
        }

        if (this.filters.year.checkboxes.findIndex(tmp => tmp.val === book.year) === -1) {
          this.filters.year.checkboxes.push({
            id: `year-${i}`,
            label: book.year,
            val: book.year,
            filter: `book.year === ${JSON.stringify(book.year)}`,
          });
        }
      }
      this.filters.publisher.checkboxes = this.filters.publisher.checkboxes.sort((c1, c2) => c1.val.localeCompare(c2.val));
      this.filters.category.checkboxes = this.filters.category.checkboxes.sort((c1, c2) => c1.val.localeCompare(c2.val));
      this.filters.rating.checkboxes = this.filters.rating.checkboxes.sort((c1, c2) => c2.val - c1.val);
      this.filters.year.checkboxes = this.filters.year.checkboxes.sort((c1, c2) => c2.val.localeCompare(c1.val));
    },
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
      this.updateFilters();
      this.pending = false;
    },
  },

  watch: {
    '$route.query': async function OnRouteChange(next) {
      if (this.$route.name === 'BooksView') {
        await this.findBooks(next);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.view.books-vue {
  .sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 300px;
    top: 83px; bottom: 33px;
    border-radius: 0 4px 4px 0;
    background-color: rgba(darken($old-lavender, 25%), .9);
    box-shadow: 2px 0 15px rgba(#000, .8);

    .h1-title { align-self: center; }

    .sorting-wrapper {
      display: flex;
      margin: 0 10px;
      #btn-sort, #btn-order {
        border-radius: 2px;
        background-color: rgba($apricot, .4);
      }
      #btn-sort { flex: 1; }
      #btn-order { margin: 0 4px; }
    }
    .filter-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      .filter {
        display: flex;
        flex-direction: column;
        .filter-title {
          padding: 4px 8px 4px 10px;
          margin: 4px 0;
          font-size: 0.8em;
          font-weight: 800;
          background-color: $melon;
          color: $dark-apricot;
          &:first-child { margin-top: 0; }
        }
        .checkbox-vue { margin: 4px 0 4px 30px; }
      }
    }
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
