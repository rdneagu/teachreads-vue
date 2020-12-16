<template>
  <div v-if="book" class="book-vue">
    <section class="reviews-section">
      <h1 class="reviews-title">Reviews</h1>
      <div class="reviews-wrapper">
        <Review v-for="(review, i) in getReversedReviews" :key="i" :id="i" :review="review" />
      </div>
      <hr class="separator" />
      <div class="reviews-add">
        <Input v-for="(field) in forms.addReview.fields" :key="field.id" v-bind="field" @update:value="field.value = $event" />
        <Button type="dialog" icon="chat1" :click="addReview">Add review</Button>
      </div>
    </section>
    <section class="main">
      <Book class="specific" :book="book" :spotlight="true" />
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
import { nextTick } from 'vue';

import { invokeAPI } from '@/lib/util.js';

import Book from '@/components/Book.component';
import Button from '@/components/Button.component';
import Input from '@/components/Input.component';
import Review from '@/components/Review.component';

export default {
  name: 'BookView',
  components: { Book, Button, Input, Review },
  data() {
    return {
      forms: {
        addReview: {
          fields: [
            {
              id: 'reviewer',
              label: 'NAME',
              placeholder: 'name',
              value: '',
              maxlength: 32,
              condition: () => !this.$store.state.user,
              default: () => this.defaultReviewer,
            },
            { id: 'review', label: 'MESSAGE', placeholder: 'review', value: '', type: 'textarea', maxlength: 512 },
          ],
          validation: [
            { regex: new RegExp('^[A-Za-z0-9]{0,32}$'), error: 'Name must contain only alphanumeric characters up to 32 characters' },
            { regex: new RegExp('^.{3,512}$'), error: 'The review message must have between 3 and 512 characters' },
          ],
        },
      },
      book: null,
      similarBooks: [],
    };
  },

  async mounted() {
    await this.loadBook();
  },

  computed: {
    defaultReviewer() {
      return (this.$store.state.user) ? this.$store.state.user.name : null;
    },
    getReversedReviews() {
      const reviews = this.book.reviews.slice().reverse();
      return reviews;
    },
    getSimilarBooks() {
      const similarBooks = this.similarBooks.slice();
      return similarBooks.filter(book => book.id !== this.book.id).sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);
    },
  },

  methods: {
    clean(form) {
      form.fields.forEach((field) => {
        delete field.error;
      });
    },
    clear(form) {
      form.fields.forEach((field) => {
        field.value = '';
      });
    },
    validate(form) {
      let valid = true;
      form.fields.forEach((field, i) => {
        if (!field.value.match(form.validation[i].regex)) {
          field.error = form.validation[i].error;
          valid = false;
        }
      });
      return valid;
    },
    async addReview() {
      this.clean(this.forms.addReview);
      await nextTick();

      if (this.validate(this.forms.addReview)) {
        const data = this.forms.addReview.fields.reduce((acc = {}, val) => {
          if (typeof (val.condition) === 'function' && !val.condition()) {
            acc[val.id] = val.default() || val.value;
          } else {
            acc[val.id] = val.value;
          }
          return acc;
        }, {});
        const result = await invokeAPI(`/api/books/${this.book.id}/review`, { method: 'post', data });
        this.book.reviews.push(result);
        this.clear(this.forms.addReview);
      }
    },
    async loadBook() {
      this.book = await invokeAPI(`/api/books/${this.$route.params.book}`);
      this.similarBooks = await invokeAPI('/api/books/search', {
        params: {
          search: {
            category: this.book.category,
          },
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
  .reviews-section {
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 280px;
    top: 83px; bottom: 33px;
    border-radius: 0 4px 4px 0;
    padding: 0 10px 10px 10px;
    background-color: rgba(darken($old-lavender, 25%), .9);
    box-shadow: 2px 0 15px rgba(#000, .8);

    .reviews-title {
      align-self: center;
    }

    .reviews-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 5px;
      overflow-y: auto;
    }

    .separator {
      border-color: rgba($apricot, .4);
      width: 100%;
    }

    .reviews-add {
      display: flex;
      flex-direction: column;
    }
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 300px;
    padding: 0 20px 35px 20px;

    .similar-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 430px;
      .similar-title {
        align-self: center;
      }
      .similar-books {
        display: grid;
        grid-template-columns: repeat(auto-fit, 240px);
        grid-template-rows: repeat(auto-fit, minmax(0px, min-content));
        grid-column-gap: 20px;
        grid-row-gap: 20px;
        justify-content: space-evenly;
        justify-items: center;
      }
    }
  }
}
</style>
