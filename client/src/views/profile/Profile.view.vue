<template>
  <div v-if="user !== undefined" class="profile-vue">
    <div v-if="user === null" class="e404">
      <span class="message"><Icon name="warning" /> This user does not exist or has not saved anything!</span>
    </div>
    <div v-else class="profile">
      <section class="interests-section">
        <span class="user">{{ $route.params.name }}</span>
        <Button :href="{ ...$route, query: { tab: 'wishlist' } }" id="view-wishlist" type="dialog">View Wishlist</Button>
        <Button :href="{ ...$route, query: { tab: 'history' } }" id="view-history" type="dialog">View Read History</Button>
        <h1 class="interests-title">Interests</h1>
        <div class="interests-wrapper">
          <div v-for="(interest, i) in user.interests" :key="i" class="interests-topic">{{ interest.category }}</div>
        </div>
      </section>
      <section class="main">
        <h1 class="list-title">{{ getActiveTab === 'history' ? 'Read History' : 'Wishlist' }}</h1>
        <div v-if="!user[getActiveTab].length" class="empty-list">
          <span class="message">This list is empty</span>
        </div>
        <template v-else>
          <div v-if="getActiveTab === 'history'" class="tab history">
            <Book v-for="book in user.history" :key="book.id" :book="book" />
          </div>
          <div v-else class="tab wishlist">
            <Book v-for="book in user.wishlist" :key="book.id" :book="book" />
          </div>
        </template>
        <div v-if="user.recommendations.length" class="commend-wrapper">
          <h1 class="commend-title">Recommended Books</h1>
          <div class="commend-books">
            <Book v-for="book in user.recommendations" :key="book.id" :book="book" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { invokeAPI } from '@/lib/util.js';

import Book from '@/components/Book.component';
import Button from '@/components/Button.component';
import Icon from '@/components/Icon.component';

export default {
  name: 'ProfileView',
  components: { Book, Button, Icon },
  data() {
    return {
      user: undefined,
    };
  },

  async mounted() {
    await this.loadProfile();
  },

  computed: {
    getActiveTab() {
      return this.$route.query.tab || 'wishlist';
    },
  },

  methods: {
    async loadProfile() {
      const { name } = this.$route.params;
      const history = await invokeAPI(`/api/history/${name}`);
      const wishlist = await invokeAPI(`/api/wishlist/${name}`);
      const interests = await invokeAPI(`/api/interests/${name}`);
      const recommendations = await invokeAPI(`/api/books/${name}/recommend`);
      this.user = { history, wishlist, interests, recommendations };

      if (!this.user.history.length && !this.user.wishlist.length && !this.user.interests.length) {
        this.user = null;
      }
    },
  },

  watch: {
    '$route.params.name': async function userChanged(next) {
      if (next) {
        await this.loadProfile();
      }
    },
  },
};
</script>

<style lang="scss">
.view.profile-vue {
  .profile, .e404 {
    flex: 1;
    display: flex;
  }

  .e404 {
    align-items: center;
    justify-content: center;
    .message {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border: 1px solid $error;
      border-radius: 4px;
      background-color: rgba($error, .2);
      color: lighten($error, 20%);
      font-weight: 600;
      font-size: 1.6em;

      .icon-vue .icon {
        font-size: 1.5em;
        margin-right: 10px;
      }
    }
  }

  .profile {
    .interests-section {
      position: fixed;
      display: flex;
      flex-direction: column;
      width: 280px;
      top: 83px; bottom: 33px; right: 0;
      border-radius: 0 4px 4px 0;
      padding: 10px;
      background-color: rgba(darken($old-lavender, 25%), .9);
      box-shadow: 2px 0 15px rgba(#000, .8);
      overflow: hidden;

      .user {
        align-self: center;
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 1.1em;
        text-align: center;
        line-height: 1.2em;
        overflow: hidden;
        white-space: break-all;
        text-overflow: ellipsis;
      }

      .button-vue { margin: 6px 40px; }

      .interests-title { align-self: center; }
      .interests-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 5px;
        overflow-y: auto;
        .interests-topic {
          position: relative;
          padding: 5px 10px;
          margin: 5px 0;
          background-color: rgba($apricot, .1);
          border: 1px solid $apricot;
          border-radius: 2px;
          font-weight: 500;
          text-align: center;
        }
      }
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-right: 300px;
      padding: 0 20px 35px 20px;

      .list-title { align-self: center; }
      .empty-list {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .message {
          padding: 10px 16px;
          background-color: rgba($apricot, .1);
          border: 1px solid $apricot;
          border-radius: 4px;
          font-size: 2em;
        }
      }
      .tab {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 225px));
        grid-column-gap: 20px;
        grid-row-gap: 20px;
        justify-content: space-evenly;
      }

      .commend-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 430px;
        margin-top: 5px;
        .commend-title { align-self: center; }
        .commend-books {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 225px));
          grid-column-gap: 20px;
          grid-row-gap: 20px;
          justify-content: center;
        }
      }
    }
  }
}
</style>
