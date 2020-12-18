<template>
  <transition name="tooltipfx">
    <div class="tooltip-vue" :style="tooltipPosition">
      <div v-if="tooltip" class="tooltip" :class="[ tooltip.type, arrowPosition ]">
        <span>{{ tooltip.text }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { nextTick } from 'vue';

export default {
  component: 'TooltipComponent',
  data() {
    return {
      tooltipPosition: null,
      arrowPosition: null,
    };
  },
  computed: {
    tooltip() {
      return this.$store.state.tooltip;
    },
  },
  watch: {
    async tooltip(to) {
      if (!to) return;
      await nextTick();
      const el = to.element;
      const tooltip = this.$el.children[0];
      const { left, top } = el.getBoundingClientRect();
      const { clientWidth } = document.querySelector('#app');
      const preset = {
        top: top - 30,
        middle: top + el.offsetHeight / 2 - tooltip.offsetHeight / 2,
        bottom: top + el.offsetHeight + 40,
        left: left - tooltip.offsetWidth - 10,
        center: left + el.offsetWidth / 2 - tooltip.offsetWidth / 2,
        right: left + tooltip.offsetWidth + 40,
      };
      const position = {
        x: { css: 'left', px: preset.center },
        y: { css: 'top', px: preset.top },
      };
      this.tooltipPosition = {};
      this.arrowPosition = 'bottom';
      if (position.x.px - tooltip.offsetWidth <= 0 || position.x.px + tooltip.offsetWidth >= clientWidth) {
        position.y = { css: 'top', px: preset.middle };
        if (position.x.px - tooltip.offsetWidth <= 0) {
          position.x = { css: 'left', px: preset.right };
          this.arrowPosition = 'left';
        }
        if (position.x.px + tooltip.offsetWidth >= clientWidth) {
          position.x = { css: 'left', px: preset.left };
          this.arrowPosition = 'right';
        }
      } else if (top - tooltip.offsetHeight - 40 <= 0) {
        position.y = { css: 'top', px: preset.bottom };
        this.arrowPosition = 'top';
      }
      this.tooltipPosition[position.x.css] = `${position.x.px}px`;
      this.tooltipPosition[position.y.css] = `${position.y.px}px`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins';

.tooltip-vue {
  position: fixed;
  z-index: 100;
  .tooltip {
    position: absolute;
    display: flex;
    align-items: center;
    padding: 4px 6px 4px 6px;
    border-radius: 2px;
    border-color: $apricot;
    border: 1px solid;
    background-color: $dark-apricot;
    box-shadow: 0 0 20px rgba(black, .6);
    font-size: 13px;
    font-weight: 600;
    white-space: pre;
    @include transition('opacity', .2s, ease);
    &:before, &:after {
      content: "";
      position: absolute;
      display: block;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      pointer-events: none;
    }
    &.alert {
      border-color: $error;
      border: 1px solid;
      color: $error;
      background-color: darken($error, 60%);
    }

    &.top:before, &.top:after, &.bottom:before, &.bottom:after {
      left: 50%;
      transform: translateX(-50%);
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
    }
    &.left:before, &.left:after, &.right:before, &.right:after {
      top: 50%;
      transform: translateY(-50%);
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
    }
    &.top:before, &.top:after { top: 0; }
    &.bottom:before, &.bottom:after { top: calc(100% + 1px); }
    &.left:before, &.left:after { left: 0; }
    &.right:before, &.right:after { left: 100%; }
    &.right {
      left: 0;
      &:before { border-left: 5px solid; }
      &:after {
        z-index: 10;
        margin-left: -1px;
        border-left: 5px solid $dark-apricot;
      }
      &.alert:after { border-left: 5px solid darken($error, 60%); }
    }
    &.bottom {
      top: 0;
      &:before { border-top: 5px solid; }
      &:after {
        margin-top: -1px;
        z-index: 10;
        border-top: 5px solid $dark-apricot;
      }
      &.alert:after { border-top: 5px solid darken($error, 60%); }
    }
    &.left {
      right: 0;
      &:before {
        left: -13px;
        border-right: 5px solid;
      }
      &:after {
        left: -12px;
        z-index: 10;
        border-right: 5px solid $dark-apricot;
      }
      &.alert:after { border-right: 5px solid darken($error, 60%); }
    }
    &.top {
      bottom: 0;
      &:before {
        top: -6px;
        border-bottom: 5px solid;
      }
      &:after {
        top: -5px;
        z-index: 10;
        border-bottom: 5px solid $dark-apricot;
      }
      &.alert:after { border-bottom: 5px solid darken($error, 60%); }
    }
  }
}

.tooltipfx-enter, .tooltipfx-leave-to {
  opacity: 0;
}
</style>
