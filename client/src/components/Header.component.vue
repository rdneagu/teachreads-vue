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
  </header>
</template>

<script>
import Button from '@/components/Button.component';

export default {
  name: 'HeaderComponent',
  components: { Button },
  data() {
    return {
      detached: false,
    };
  },

  computed: {
    isDetached() {
      return (this.detached) ? 'detached' : null;
    },
  },

  mounted() {
    window.addEventListener('scroll', this.OnScroll);
  },

  unmounted() {
    window.removeEventListener('scroll', this.OnScroll);
  },

  methods: {
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

<style lang="scss" scoped>
@import '@/scss/_mixins';

header {
  font-size: 16px;
  position: fixed;
  width: 100%;
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
      font-size: 1em;
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
}
</style>
