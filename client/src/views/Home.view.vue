<template>
  <div class="home-vue">
    <div class="intro">
      <section class="intro-text">Best book database for technology books</section>
      <Button id="more" name="more" type="dialog">See More</Button>
    </div>
    <div class="best-rated">
      <h1 class="h1-title">Best Rated</h1>
      <div class="best-rated-list">
        <Book v-for="book in bestRated" :key="book.id" :book="book" />
      </div>
    </div>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util';

import Book from '@/components/Book.component';
import Button from '@/components/Button.component';

export default {
  name: 'HomeView',
  components: { Book, Button },
  data() {
    return {
      bestRated: [],
    };
  },
  async mounted() {
    this.bestRated = await invokeAPI('/api/books/best');
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_mixins';

.view.home-vue {
  flex-direction: column;

  .intro {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 180px;

    #more { margin: 10px 0; }
  }

  .best-rated {
    position: relative;
    display: flex;
    flex-direction: column;
    .h1-title { align-self: center; }
    .best-rated-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, 240px);
      grid-template-rows: repeat(auto-fit, minmax(0px, min-content));
      grid-column-gap: 4px;
      grid-row-gap: 4px;
      justify-content: space-evenly;
      justify-items: center;
      padding: 20px;
    }
  }
}
</style>
