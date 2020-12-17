<template>
  <div v-if="book" class="book-vue" :class="[ isSpotlight ]">
    <div class="cover" />
    <div class="details">
      <span class="title" :title="book.title">{{ book.title }}</span>
      <span class="author" :title="getAuthors">by <span class="author-name">{{ getAuthors }}</span></span>
      <div class="category-wrapper">
        <span class="release">{{ book.year }}</span>
        <span class="category">{{ book.category }}</span>
        <Button
          v-if="spotlight && $store.state.user"
          id="interest"
          :type="isInterest.type"
          :icon="isInterest.icon"
          :click="isInterest.fn">
            INTEREST
        </Button>
      </div>
      <div class="rating">
        <span v-if="getRating.avgRating" class="rating-number">{{ getRating.avgRating.toFixed(1) }}</span>
        <Icon
          v-for="(star, i) in getRating.stars"
          :key="i"
          :name="star"
          :class="[ isRatingHovered(i) ]"
          @mouseover="() => mouseoverRating(i)"
          @mouseout="() => mouseoutRating(i)"
          @click="() => rateBook(i)"
        />
        <span class="count times-rated">{{ book.ratings.length }}</span>
        <Icon name="person" />
        <span class="count times-reviewed">{{ book.reviews.length }}</span>
        <Icon name="chat1" />
        <span class="count times-wished">{{ book.nWished }}</span>
        <Icon name="heart" />
        <span class="count times-read">{{ book.nRead }}</span>
        <Icon name="bookmark" />
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
        <div class="chart">
          <div v-if="book.ratings.length" class="condition-wrapper">
            <apexchart height="180px" :options="chartOptions" :series="getChartSeries" />
          </div>
        </div>
      </template>
      <Button v-else :href="`/books/${book.id}`" id="view-book" type="bzard" icon="book">View Book</Button>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import { invokeAPI } from '@/lib/util.js';

import Icon from './Icon.component';
import Button from './Button.component';

export default {
  name: 'BookComponent',
  components: { Icon, Button },
  props: ['book', 'spotlight'],
  data() {
    return {
      ratingHovered: null,
      chartOptions: {
        chart: {
          width: '280px',
          type: 'area',
          toolbar: {
            show: false,
            tools: {
              zoom: false,
            },
          },
        },
        fill: {
          type: ['gradient'],
          colors: ['#FFCDB2', '#00AAFF'],
        },
        grid: {
          borderColor: '#7C6457',
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: ['smooth', 'straight'],
          width: [1.5, 4],
          colors: ['#FFCDB2', '#00AAFF'],
        },
        legend: {
          show: false,
          labels: {
            colors: ['#FFCDB2'],
          },
          markers: {
            fillColors: ['#FFCDB2', '#00AAFF'],
          },
        },
        markers: {
          size: [4, 0],
          colors: ['#FFCDB2'],
          strokeWidth: 1,
          strokeColors: '#504038',
          hover: {
            sizeOffset: 2,
          },
        },
        yaxis: {
          min: 1,
          max: 5,
          tickAmount: 4,
          labels: {
            style: {
              colors: '#FFCDB2',
              fontFamily: 'Arial',
              fontSize: '14px',
            },
            formatter: value => value.toFixed(0),
          },
          crosshairs: {
            stroke: {
              color: '#FFCDB2',
              dashArray: [4, 4],
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        tooltip: {
          fixed: {
            enabled: true,
            offsetY: -9999,
            offsetX: -9999,
          },
        },
        title: {
          text: 'Ratings History',
          align: 'center',
          style: {
            fontFamily: 'Raleway',
            fontWeight: 600,
            color: '#FFCDB2',
          },
        },
      },
    };
  },
  computed: {
    isRatingHovered() {
      return index => ((this.ratingHovered !== null && index <= this.ratingHovered) ? 'hovered' : null);
    },
    isSpotlight() {
      return (this.spotlight) ? 'spotlight' : null;
    },
    getAuthors() {
      return this.book.authors.join(', ');
    },
    getRating() {
      const sumRating = this.book.ratings.reduce((acc, val) => acc + val, 0);
      const avgRating = (sumRating / this.book.ratings.length) || 0;

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
    },
    getChartSeries() {
      if (!this.book.ratings.length) {
        return [];
      }
      return [
        {
          name: 'Ratings',
          type: 'area',
          data: this.getDataSeries,
        },
        {
          name: 'Trend',
          type: 'line',
          data: this.getLinearRegression,
        },
      ];
    },
    getDataSeries() {
      return this.book.ratings.slice().map((rating, i) => [i, rating]);
    },
    getLinearRegression() {
      const data = this.book.ratings.slice().map((rating, i) => [i, rating]);
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumXX = 0;
      let count = 0;
      let m = 0;
      let b = 0;

      if (data.length === 0) {
        throw new Error('Empty data');
      }

      // calculate sums
      for (let i = 0, len = data.length; i < len; i++) {
        const point = data[i];
        sumX += point[0];
        sumY += point[1];
        sumXX += point[0] * point[0];
        sumXY += point[0] * point[1];
        count++;
      }

      // calculate slope (m) and y-intercept (b) for f(x) = m * x + b
      m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
      b = (sumY / count) - (m * sumX) / count;

      return data.map(d => [d[0], m * d[0] + b]);
    },
    isInterest() {
      if (this.$store.state.user) {
        const interestFound = this.$store.state.user.interests.find(interest => interest.category === this.book.category);
        const state = {
          icon: interestFound ? 'minus' : 'plus1',
          type: `${interestFound ? 'red' : 'blue'} tag dialog`,
          fn: interestFound ? this.deleteInterest : this.addInterest,
        };
        return state;
      }
      return false;
    },
    isHistory() {
      if (this.$store.state.user) {
        const historyFound = this.$store.state.user.history.find(book => book.id === this.book.id);
        const state = {
          icon: historyFound ? 'bookmark' : 'bookmark_outline',
          text: historyFound ? 'Mark as unread' : 'Mark as read',
          fn: historyFound ? this.deleteReadHistory : this.addReadHistory,
        };
        return state;
      }
      return false;
    },
    isWishlist() {
      if (this.$store.state.user) {
        const wishlistFound = this.$store.state.user.wishlist.find(book => book.id === this.book.id);
        const state = {
          icon: wishlistFound ? 'heart' : 'heart-o',
          text: wishlistFound ? 'Remove from wishlist' : 'Add to wishlist',
          fn: wishlistFound ? this.deleteWishlistItem : this.addWishlistItem,
        };
        return state;
      }
      return false;
    },
  },
  methods: {
    mouseoverRating(i) {
      if (this.$store.state.user && this.spotlight) {
        this.ratingHovered = i;
      }
    },
    mouseoutRating() {
      this.ratingHovered = null;
    },
    async rateBook(i) {
      if (this.$store.state.user && this.spotlight) {
        const data = {
          rating: i + 1,
        };
        await invokeAPI(`/api/books/${this.book.id}/rate`, { method: 'post', data });
        this.book.ratings.push(data.rating);
      }
    },
    async deleteInterest() {
      try {
        await invokeAPI(`/api/interests/${this.$store.state.user.name}/delete/${this.book.category}`, { method: 'delete' });
        const interestId = this.$store.state.user.interests.findIndex(interest => interest.category === this.book.category);
        this.$store.state.user.interests.splice(interestId, 1);
      } catch (err) {
        console.error(err);
      }
    },
    async addInterest() {
      const data = {
        user: this.$store.state.user.name,
        category: this.book.category,
      };
      const result = await invokeAPI('/api/interests/add', { method: 'post', data });
      this.$store.state.user.interests.push(result);
    },
    async deleteReadHistory() {
      try {
        await invokeAPI(`/api/history/${this.$store.state.user.name}/delete/${this.book.id}`, { method: 'delete' });
        const historyId = this.$store.state.user.history.findIndex(book => book.id === this.book.id);
        this.$store.state.user.history.splice(historyId, 1);
        this.book.nRead--;
      } catch (err) {
        console.error(err);
      }
    },
    async addReadHistory() {
      const data = {
        user: this.$store.state.user.name,
        book: this.book.id,
      };
      const result = await invokeAPI('/api/history/add', { method: 'post', data });
      this.$store.state.user.history.push(result);
      this.book.nRead++;
    },
    async deleteWishlistItem() {
      try {
        await invokeAPI(`/api/wishlist/${this.$store.state.user.name}/delete/${this.book.id}`, { method: 'delete' });
        const itemId = this.$store.state.user.wishlist.findIndex(book => book.id === this.book.id);
        this.$store.state.user.wishlist.splice(itemId, 1);
        this.book.nWished--;
      } catch (err) {
        console.error(err);
      }
    },
    async addWishlistItem() {
      const data = {
        user: this.$store.state.user.name,
        book: this.book.id,
      };
      const result = await invokeAPI('/api/wishlist/add', { method: 'post', data });
      this.$store.state.user.wishlist.push(result);
      this.book.nWished++;
    },
  },
};
</script>

<style lang="scss">
.chart {
  .apexcharts-yaxistooltip {
    background: $dark-apricot;
    border: 1px solid $apricot;
    color: $apricot;
  }
}
</style>

<style lang="scss" scoped>
.book-vue {
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  background-color: rgba($apricot, .2);
  width: 240px;
  box-shadow: 0 4px 15px rgba(black, .8);
  .cover {
    height: 260px;
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

    .category-wrapper {
      display: flex;
      align-items: center;
      margin: 10px 0 5px 0;

      .release {
        margin-right: 6px;
        padding-right: 6px;
        font-family: Arial;
        font-weight: 600;
        border-right: 1px solid $apricot;
      }
    }

    .rating {
      display: flex;
      align-items: center;
      margin: 5px 0;
      font-weight: 600;
      color: darken($apricot, 20%);
      overflow: hidden;
      white-space: nowrap;

      span { font-family: Arial; }
      .icon-vue.hovered {
        color: $apricot;
        cursor: pointer;
      }
      .rating-number { margin-right: 2px; }
      .count {
        margin: 0 2px 0 8px;
        &.times-rated {
          margin-left: 2px;
        }
        &:first-child {
          margin-left: 0;
        }
      }
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
      display: grid;
      grid-template-areas: "title chart"
                           "authors chart"
                           "category chart"
                           "rating chart"
                           "description chart"
                           "buttons buttons";
      grid-template-rows: auto auto auto auto 1fr auto;
      grid-template-columns: 1fr auto;
      .title {
        grid-area: title;
        font-size: 1.5em;
        word-break: break-word;
        white-space: normal;
      }
      .authors { grid-area: authors; }
      .category-wrapper {
        grid-area: category;
        #interest { margin-left: 8px; }
      }
      .rating {
        grid-area: rating;
        flex: 0;
      }
      .description {
        grid-area: description;
        flex: 1;
        margin: 5px 0;
        font-size: 1.1em;
        line-height: 1.2em;
      }
      .chart {
        grid-area: chart;
        display: flex;
        align-items: center;
      }
      .buttons {
        grid-area: buttons;
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
