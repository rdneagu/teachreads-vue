<template>
  <div v-if="isCondition" class="button-vue">
    <router-link v-if="href" :to="href" class="button" :class="[ getName, getStyle, isActive ]">
      <Icon v-if="icon" :name="icon"></Icon>
      <span v-if="text || $slots.default" class="text"><slot>{{ this.text }}</slot></span>
    </router-link>
    <div v-else class="button" :class="[ getName, getStyle, isDisabled, isActive ]" @click.capture="OnButtonClick">
      <Icon v-if="icon" :name="isPending"></Icon>
      <span v-if="text || $slots.default" class="text"><slot>{{ this.text }}</slot></span>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.component.vue';

export default {
  name: 'ButtonComponent',
  props: ['name', 'href', 'type', 'icon', 'text', 'click', 'disabled', 'active', 'pending', 'condition'],
  components: { Icon },
  computed: {
    getName() {
      return (this.name) ? `btn-${this.name}` : null;
    },
    getStyle() {
      return (this.type) ? `${this.type}-style` : null;
    },
    isActive() {
      return (this.active || this.$route.path.slice(1) === this.href) ? 'active' : false;
    },
    isDisabled() {
      return (this.disabled) ? 'disabled' : null;
    },
    isPending() {
      return (this.pending) ? 'spinner-quad' : this.icon;
    },
    isCondition() {
      if (typeof (this.condition) !== 'function') return true;
      return this.condition();
    },
  },
  methods: {
    async OnButtonClick() {
      if (typeof (this.click) !== 'function' || this.disabled) return false;
      return this.click();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_mixins.scss';

.button-vue {
  position: relative;
  .button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    word-wrap: nowrap;
    cursor: pointer;
    .text {
      font-weight: 600;
      text-align: center;
    }
    .icon-vue {
      position: relative;
      margin: 0 4px 0 4px;
    }
    &.inversed {
      .text { order: 1; }
      .icon-vue { order: 2; }
    }
    &.disabled {
      cursor: default;
      opacity: .4;
    }
    @include disable-select();
  }

  .bzard-style {
    padding: 6px 16px;
    background-color: darken($apricot, 15%);
    color: black;
    box-shadow: 0 1px 1px rgba(black, .3), 0 0 1px 1px rgba(white, .15) inset;
    @include transition('background-color, box-shadow', .2s, ease);
    &:not(.disabled) {
      &.is-active, &:hover {
        background-color: darken($apricot, 20%);
      }
    }
  }

  .dialog-style {
    padding: 8px 20px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-radius: 3px;
    background: linear-gradient(to bottom, darken($apricot, 10%), darken($apricot, 20%));
    background-blend-mode: screen;
    .text {
      color: black;
      font-weight: 500;
    }
    box-shadow: 0 1px 2px rgba(black, .8), 0 0 1px 1px rgba(white, .15) inset;
    @include transition('background-color, border', .2s, ease);
    &:not(.disabled) {
      &.is-active, &:hover {
        background-color: darken($apricot, 35%);
        border-color: $apricot;
      }
    }
    // &.notice {
    //   background: linear-gradient(to bottom, darken($color-mustard, 30%), darken($color-mustard, 40%));
    //   color: lighten($color-mustard, 40%);
    //   &:hover:not(.disabled) {
    //     background-color: darken($color-mustard, 60%);
    //     border-color: $color-mustard;
    //   }
    // }
    // &.google, &.alert {
    //   background: linear-gradient(to bottom, #dd4a36, darken(#dd4a36, 10%));
    //   color: lighten(#dd4a36, 40%);
    //   &:hover:not(.disabled) {
    //     background-color: darken(#c93737, 35%);
    //     border-color: #c93737;
    //   }
    // }
    // &.facebook {
    //   background: linear-gradient(to bottom, #7289da, darken(#7289da, 10%));
    //   color: lighten(#7289da, 40%);
    //   &:hover:not(.disabled) {
    //     background-color: darken(#7289da, 35%);
    //     border-color: #7289da;
    //   }
    // }
  }

  .search-style {
    padding: 8px 20px;
    border-radius: 0 6px 6px 0;
    background: linear-gradient(to bottom, darken($apricot, 10%), darken($apricot, 20%));
    background-blend-mode: screen;
    .icon {
      font-weight: 600;
      color: black;
    }
    @include transition('background-color, border', .2s, ease);
    &:before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 0 6px 6px 0;
      box-shadow: 1px 0 0 darken($apricot, 45%), -1px 0 0 darken($apricot, 45%);
    }
    &:not(.disabled) {
      &.active, &:hover {
        background-color: darken($apricot, 35%);
        border-color: $apricot;
      }
    }
  }

  .tab-style {
    padding: 8px 20px;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(to bottom, darken($apricot, 10%), darken($apricot, 20%));
    background-blend-mode: screen;
    color: lighten($apricot, 40%);
    box-shadow: 0 -1px 0 rgba(black, .8);
    @include transition('background-color, border', .2s, ease);
    z-index: 1;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 6px 6px 0 0;
      box-shadow: -1px 0 0 darken($apricot, 45%), 1px 0 0 darken($apricot, 45%);
    }
    &.active {
      &:before {
        bottom: 8px;
      }
    }
    &:not(.disabled) {
      &.active, &:hover {
        background-color: lighten($apricot, 30%);
        border-color: $apricot;
      }
    }
  }

  .plain-style {
    padding: 10px;
    @include transition('color', .2s, ease);
    &:hover, &.active { color: lighten($apricot, 20%); }
  }

  .icon-style {
    .icon-wrapper { margin: 0; }
    @include transition('color', .2s, ease);
    &:hover, &.active { color: lighten($apricot, 20%); }
  }

  .header-style {
    padding: 8px 10px;
    font-size: 18px;
    @include transition('color, background-color', .2s, ease);
    &:hover, &.active { color: lighten($apricot, 20%); }
    &.active { background-color: rgba(darken($apricot, 20%), .3); }
  }

  .expand-style {
    padding: 4px 12px;
    .text { flex: 1; }
    @include transition('color, background-color', .2s, ease);
    &:hover, &.active {
      color: lighten($apricot, 20%);
      background-color: rgba($apricot, .2);
    }
  }
}
</style>
