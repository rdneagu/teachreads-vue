<template>
  <div v-if="book" class="book-vue">
    <section class="reviews">
      <span v-for="(review, i) in book.reviews" :key="i">{{ review.review }}</span>
    </section>
    <section class="main">
      <div class="about">
        <div class="cover" />
        <div class="details">
          <span class="title" :title="book.title">{{ book.title }}</span>
          <span class="author" :title="getAuthors">by <span class="author-name">{{ getAuthors }}</span></span>
          <span class="category">{{ book.category }}</span>
          <div class="rating">
            <template v-if="getRating">
              <span class="rating-number">{{ getRating.avgRating.toFixed(1) }}</span>
              <Icon v-for="(star, i) in getRating.stars" :key="i" :name="star" />
            </template>
          </div>
        </div>
      </div>
      <div v-show="getSimilarBooks.length" class="similar-wrapper">
        <h1 class="similar-title">Similar Books</h1>
        <div class="similar-books">
          <Book v-for="book in getSimilarBooks" :key="book.id" :book="book" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util.js';

import Book from '@/components/Book.component';

export default {
  name: 'BookView',
  components: { Book },
  data() {
    return {
      book: null,
      similarBooks: [],
    };
  },

  async mounted() {
    await this.loadBook();
  },

  computed: {
    getSimilarBooks() {
      const similarBooks = this.similarBooks.slice();
      return similarBooks.sort((a, b) => b.avgRating - a.avgRating);
    },
  },

  methods: {
    async loadBook() {
      this.book = await invokeAPI(`/api/books/${this.$route.params.book}`);
      this.similarBooks = await invokeAPI('/api/books/search', {
        params: {
          search: {
            category: this.book.category,
          },
          limit: 5,
        },
      });
    },
  },

  watch: {
    '$route.params.book': async function bookChanged(next) {
      if (next) {
        await this.loadBook();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.view.book-vue {
  .reviews {
    position: fixed;
    width: 300px;
    top: 83px; bottom: 33px;
    border-radius: 0 4px 4px 0;
    background-color: rgba(darken($old-lavender, 25%), .9);
    box-shadow: 2px 0 15px rgba(#000, .8);
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 300px;
    padding: 0 20px 35px 20px;

    .about {
      flex: 1;
      display: flex;
      .cover {
        width: 225px;
        height: 250px;
        background-color: $english-lavender;
        border-radius: 2px;
      }
      .details {
        flex: 1;
      }
    }

    .similar-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 430px;
      .similar-title {
        align-self: center;
      }
      .similar-books {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 225px));
        grid-column-gap: 20px;
        grid-row-gap: 20px;
        justify-content: center;
        justify-items: center;
      }
    }
  }
}
</style>
