<template>
  <div v-if="book" class="book-vue">
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
      <Button :href="`/books/${book.id}`" id="view-book" type="bzard" :click="viewBook">View Book</Button>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.component';
import Button from './Button.component';

export default {
  name: 'BookComponent',
  props: ['book'],
  components: { Icon, Button },
  computed: {
    getAuthors() {
      return this.book.authors.join(', ');
    },
    getRating() {
      const { avgRating = 0 } = this.book;
      if (avgRating) {
        const stars = [];
        for (let i = 0; i < 5; i++) {
          if (i - avgRating <= -1) {
            stars[i] = 'star';
          } else if (i - avgRating <= -0.5) {
            stars[i] = 'star_half';
          } else {
            stars[i] = 'star_outline';
          }
        }
        return { avgRating, stars };
      }
      return null;
    },
  },
  methods: {
    viewBook() {

    },
  },
};
</script>

<style lang="scss" scoped>
.book-vue {
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  background-color: rgba($apricot, .2);
  width: 225px;
  box-shadow: 0 4px 15px rgba(black, .8);
  .cover {
    height: 250px;
    background-color: $english-lavender;
    border-radius: 2px;
  }
  .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    font-size: 0.9em;

    .title {
      color: $pastel-pink;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .author {
      font-weight: 300;
      margin-top: 2px;
      font-size: 0.9em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .author-name {
        font-weight: 600;
      }
    }

    .category { margin: 10px 0 5px 0; }

    .rating {
      flex: 1;
      display: flex;
      align-items: center;
      margin: 5px 0;
      font-weight: 600;
      color: darken($apricot, 20%);

      .rating-number {
        font-family: Arial;
        margin-right: 5px;
      }
    }
  }
}
</style>
