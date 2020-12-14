<template>
  <div v-if="book" class="book-vue" :class="[ isSpotlight ]">
    <div class="cover" />
    <div class="details">
      <span class="title" :title="book.title">{{ book.title }}</span>
      <span class="author" :title="getAuthors">by <span class="author-name">{{ getAuthors }}</span></span>
      <span class="category">{{ book.category }}</span>
      <div class="rating">
        <template v-if="getRating">
          <span class="rating-number">{{ getRating.avgRating.toFixed(1) }}</span>
          <Icon v-for="(star, i) in getRating.stars" :key="i" :name="star" />
          <span class="count">{{ book.ratings.length }}</span>
          <Icon name="person" />
          <span class="count">{{ book.reviews.length }}</span>
          <Icon name="chat1" />
        </template>
      </div>
      <template v-if="spotlight">
        <span class="description">{{ book.description }}</span>
        <div class="buttons">
          <Button id="find-store" type="dialog" icon="books">Find Store</Button>
          <template v-if="$store.state.user">
            <Button id="wishlist" type="dialog" :icon="isWishlist.icon" :click="isWishlist.fn">{{ isWishlist.text }}</Button>
            <Button id="bookmark" type="dialog" :icon="isHistory.icon" :click="isHistory.fn">{{ isHistory.text }}</Button>
          </template>
        </div>
      </template>
      <Button v-else :href="`/books/${book.id}`" id="view-book" type="bzard" icon="book">View Book</Button>
    </div>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util.js';

import Icon from './Icon.component';
import Button from './Button.component';

export default {
  name: 'BookComponent',
  props: ['book', 'spotlight'],
  components: { Icon, Button },
  computed: {
    isSpotlight() {
      return (this.spotlight) ? 'spotlight' : null;
    },
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
    isHistory() {
      if (this.$store.state.user) {
        const historyFound = this.$store.state.user.history.find(item => item.book === this.book.id);
        const state = {
          icon: historyFound ? 'bookmark' : 'bookmark_outline',
          text: historyFound ? 'Mark as unread' : 'Mark as read',
          fn: historyFound ? this.removeReadHistory : this.addReadHistory,
        };
        return state;
      }
      return false;
    },
    isWishlist() {
      if (this.$store.state.user) {
        const wishlistFound = this.$store.state.user.wishlist.find(item => item.book === this.book.id);
        const state = {
          icon: wishlistFound ? 'heart' : 'heart-o',
          text: wishlistFound ? 'Remove from wishlist' : 'Add to wishlist',
          fn: wishlistFound ? this.removeWishlist : this.addWishlist,
        };
        return state;
      }
      return false;
    },
  },
  methods: {
    async removeReadHistory() {
      console.log('remove read history');
    },
    async addReadHistory() {
      const data = {
        user: this.$store.state.user.name,
        book: this.book.id,
      };
      const result = await invokeAPI('/api/history/add', { method: 'post', data });
      this.$store.state.user.history.push(result);
      console.log(result);
    },
    async removeWishlist() {
      console.log('remove wishlist');
    },
    async addWishlist() {
      const data = {
        user: this.$store.state.user.name,
        book: this.book.id,
      };
      const result = await invokeAPI('/api/wishlist/add', { method: 'post', data });
      this.$store.state.user.wishlist.push(result);
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

      span { font-family: Arial; }
      .rating-number { margin-right: 5px; }
      .count { margin: 0 2px 0 6px; }
    }
  }

  &.spotlight {
    flex-grow: 0;
    flex-direction: row;
    align-items: center;
    width: auto;
    padding: 8px;

    .cover {
      width: 200px;
      height: 250px;
      background-color: $english-lavender;
    }

    .details {
      align-self: stretch;
      justify-content: flex-end;
      .rating { flex: 0; }
      .title {
        font-size: 1.5em;
        word-break: break-word;
        white-space: normal;
      }
      .description {
        flex: 1;
        font-size: 1.1em;
        margin: 5px 0;
      }
      .buttons {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        grid-template-areas: "find . wishlist bookmark";
        grid-column-gap: 8px;
        #find-store { grid-area: find; }
        #wishlist { grid-area: wishlist; }
        #bookmark { grid-area: bookmark; }
      }
    }
  }
}
</style>
