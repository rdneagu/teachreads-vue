<template>
  <header class="header-vue" :class="[ isDetached ]">
    <section class="header-navigation">
      <router-link to="/" class="logo">TechReads</router-link>
      <div class="navigation">
        <router-link to="/books" class="navigation-lnk">Books</router-link>
      </div>
    </section>
    <section class="header-search">
      <input placeholder="quick search" />
      <!-- <div class="search-filter">TITLE</div> -->
      <Button name="search" icon="search" type="search" />
    </section>
    <section class="header-user">
      <template v-if="switching.state">
        <span v-if="switching.pending">Loading user</span>
        <template v-else>
          <input class="input-switch" :value="getCurrentUser" @input="switching.value = $event.target.value" />
          <Button class="confirm-switch" type="dialog" icon="confirm-switch" :click="confirmSwitch" />
          <Button class="cancel-switch" type="dialog" icon="cancel-switch" :click="cancelSwitch" />
        </template>
      </template>
      <template v-else>
        <span class="user-name">{{ getCurrentUser }}</span>
        <Button class="switch" type="dialog" icon="switch" :click="startSwitch" />
      </template>
    </section>
  </header>
</template>

<script>
import { invokeAPI } from '@/lib/util.js';

import Button from '@/components/Button.component';

export default {
  name: 'HeaderComponent',
  components: { Button },
  data() {
    return {
      switching: {
        state: false,
        pending: false,
      },
      detached: false,
    };
  },

  mounted() {
    this.switching.value = this.getCurrentUser;
    window.addEventListener('scroll', this.OnScroll);
  },

  unmounted() {
    window.removeEventListener('scroll', this.OnScroll);
  },

  computed: {
    getCurrentUser() {
      if (this.switching.state) {
        return this.switching.value;
      }
      const { user } = this.$store.state;
      return (user && user.name) ? user.name : 'Guest';
    },
    isDetached() {
      return (this.detached) ? 'detached' : null;
    },
  },

  methods: {
    startSwitch() {
      this.switching.state = true;
    },
    cancelSwitch() {
      this.switching.state = false;
      this.switching.value = this.getCurrentUser;
    },
    async confirmSwitch() {
      this.switching.pending = true;
      const name = this.switching.value;
      if (name.length < 3 || name.toLowerCase().match('guest')) {
        this.$store.commit('unsetUser');
      } else {
        const history = await invokeAPI(`/api/history/${name}`);
        console.log(history);
        const wishlist = await invokeAPI(`/api/wishlist/${name}`);
        this.$store.commit('setUser', { name, history, wishlist });
      }
      this.switching.state = false;
      this.switching.value = this.getCurrentUser;
      this.switching.pending = false;
    },
    OnScroll() {
      if (window.scrollY > 0) {
        this.detached = true;
      } else {
        this.detached = false;
      }
    },
  },

};
</script>

<style lang="scss">
@import '@/scss/_mixins';

.header-vue {
  font-size: 16px;
  position: fixed;
  left: 0; right: 0;
  height: 75px;
  display: grid;
  grid-template-columns: 3fr 4fr 3fr;
  grid-template-areas: "left search .";
  align-items: center;
  padding: 4px 40px;
  z-index: 1;

  @include transition('background-color, font-size, height');

  &.detached {
    background-color: rgba(darken($old-lavender, 25%), .95);
    font-size: 12px;
    height: 30px;
    box-shadow: 0 2px 8px rgba(black, .5);
  }

  .header-navigation {
    grid-area: left;
    display: flex;

    .logo {
      font-size: 1.5em;
      font-weight: 700;
    }

    .navigation {
      display: flex;
      align-items: center;
      &::before {
        content: "";
        height: 100%;
        border-left: 1px solid rgba($apricot, .6);
        margin: 0 20px 0 40px;
      }

      .navigation-lnk { margin: 0 20px; }
    }
  }

  .header-search {
    grid-area: search;
    display: flex;
    align-items: center;
    margin: 0 20px;
    border-radius: 6px;
    background-color: rgba($apricot, .4);

    input {
      flex: 1;
      padding: 5px 10px;
      font-weight: 600;

      @include set-placeholder($apricot);
    }

    .search-filter {
      width: 100px;
      padding: 0 10px;
      font-size: 0.8em;
      font-weight: 600;
      text-align: center;
    }

    .search-icon {
      align-self: stretch;
      padding: 0 10px;
      background-color: $apricot;
      color: black;
    }
  }

  .header-user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > * {
      margin: 0 5px;
    }
    .user-name {
      margin: 0 8px;
    }
    .input-switch {
      align-self: stretch;
      background-color: rgba($apricot, .2);
      padding: 0 10px;
    }
    .button-vue .button {
      padding: 2px 6px;
    }
  }
}
</style>
