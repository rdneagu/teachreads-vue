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

@include font-face('techreads-ico', '../assets/fonts/techreads-ico/techreads-ico', normal, normal, ttf woff svg, 'block', 'crx9fy');

$icon-star_outline: "\e901";
$icon-star_half: "\e902";
$icon-star: "\e903";
$icon-search: "\e900";

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

.icon-star_outline {
  &:before {
    content: $icon-star_outline;
  }
}
.icon-star_half {
  &:before {
    content: $icon-star_half;
  }
}
.icon-star {
  &:before {
    content: $icon-star;
  }
}
.icon-search {
  &:before {
    content: $icon-search;
  }
}

</style>
