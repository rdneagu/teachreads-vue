<template>
  <div v-if="isCondition" class="button-vue" v-tooltip="{ ...tooltip }">
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
  props: ['name', 'href', 'type', 'icon', 'text', 'click', 'disabled', 'active', 'pending', 'condition', 'tooltip'],
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
    font-weight: 600;
    word-wrap: nowrap;
    cursor: pointer;
    .text {
      text-align: center;
      &:nth-child(2) { margin-left: 4px; }
    }
    .icon-vue {
      position: relative;
      &:nth-child(2) { margin-left: 4px; }
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
    &:hover:not(.disabled) {
      background-color: darken($apricot, 20%);
    }
  }

  .dialog-style {
    padding: 8px 20px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-radius: 3px;
    background: linear-gradient(to bottom, darken($apricot, 10%), darken($apricot, 20%));
    background-blend-mode: screen;
    color: black;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(black, .8), 0 0 1px 1px rgba(white, .15) inset;
    @include transition('background-color, border', .2s, ease);
    &:not(.disabled) {
      &.is-active, &:hover {
        background-color: darken($apricot, 35%);
        border-color: $apricot;
      }
    }

    &.tag {
      padding: 2px 6px;
      border-radius: 2px;
      color: $apricot;
      font-size: 10px;
      font-weight: 700;
    }

    &.red {
      background: linear-gradient(to bottom, #dd4a36, darken(#dd4a36, 10%));
      color: lighten(#dd4a36, 40%);
      &:hover:not(.disabled) {
        background-color: darken(#c93737, 35%);
        border-color: #c93737;
      }
    }
    &.blue {
      background: linear-gradient(to bottom, #7289da, darken(#7289da, 10%));
      color: lighten(#7289da, 30%);
      &:hover:not(.disabled) {
        background-color: darken(#7289da, 35%);
        border-color: #7289da;
      }
    }
  }

  .border-style {
    padding: 4px 14px;
    border: 1px solid $apricot;
    border-width: 2px 0;
    border-radius: 4px;
    color: $apricot;
    font-weight: 400;
    @include transition('background-color, color', .2s, ease);
    &:hover {
      background-color: rgba($apricot, .1);
      color: lighten($apricot, 10%);
    }
  }

  .search-style {
    padding: 8px 20px;
    border-radius: 0 6px 6px 0;
    background: linear-gradient(to bottom, darken($apricot, 10%), darken($apricot, 20%));
    background-blend-mode: screen;
    font-weight: 600;
    color: black;
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
}
</style>
