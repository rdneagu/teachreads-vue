<template>
  <div class="icon-vue" :class="[ isDisabled ]">
    <img v-if="img" :src="getImage" :class="[ getIcon ]" />
    <i v-else class="icon" :class="[ getIcon ]"></i>
  </div>
</template>

<script>
export default {
  name: 'IconComponent',
  props: ['name', 'disabled', 'click', 'img'],
  computed: {
    isDisabled() {
      return (this.disabled) ? 'disabled' : false;
    },
    getImage() {
      return require(`../assets/images/${this.img}.png`); // eslint-disable-line
    },
    getIcon() {
      return `icon-${this.name}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_mixins';

@include font-face('techreads-ico', '../assets/fonts/techreads-ico/techreads-ico', normal, normal, ttf woff svg, 'block', 'crx9gi');

.icon {
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'techreads-ico' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-search:before { content: $icon-search; }
.icon-star_outline:before { content: $icon-star_outline; }
.icon-star_half:before { content: $icon-star_half; }
.icon-star:before { content: $icon-star; }
.icon-person:before { content: $icon-person; }
.icon-chat:before { content: $icon-chat; }
.icon-chat1:before { content: $icon-chat1; }
.icon-shopping-cart:before { content: $icon-shopping-cart; }
.icon-book:before { content: $icon-book; }
.icon-menu_book:before { content: $icon-menu_book; }
.icon-warning:before { content: $icon-warning; }
.icon-books:before { content: $icon-books; }
.icon-confirm-switch:before { content: $icon-confirm-switch; }
.icon-cancel-switch:before { content: $icon-cancel-switch; }
.icon-switch:before { content: $icon-switch; }
.icon-heart-o:before { content: $icon-heart-o; }
.icon-heart:before { content: $icon-heart; }
.icon-bookmark:before { content: $icon-bookmark; }
.icon-bookmark_outline:before { content: $icon-bookmark_outline; }
.icon-minus:before { content: $icon-minus; }
.icon-plus1:before { content: $icon-plus1; }
.icon-arrow_drop_down:before { content: $icon-arrow_drop_down; }
.icon-clear:before { content: $icon-clear; }
.icon-check:before { content: $icon-check; }
.icon-check1:before { content: $icon-check1; }
</style>
