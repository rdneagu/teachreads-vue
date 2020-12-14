<template>
  <div class="review-vue">
    <span class="reviewer" :class="[ getAlternate ]">{{ review.reviewer }}</span>
    <span class="message">{{ review.review }}</span>
  </div>
</template>

<script>
export default {
  name: 'ReviewComponent',
  props: ['id', 'review'],
  computed: {
    getAlternate() {
      return (this.id % 2 === 0) ? 'left' : 'right';
    },
  },
};
</script>

<style lang="scss" scoped>
.review-vue {
  position: relative;
  padding: 15px;
  margin: 10px 0;
  background-color: rgba($apricot, .1);
  border: 1px solid $apricot;
  border-top: none;
  border-radius: 4px;

  .reviewer {
    display: flex;
    position: absolute;
    font-size: 0.9em;
    font-weight: 600;
    left: 0; right: 0; top: -6px;
    &::before, &::after {
      content: "";
      position: relative;
      top: 6px;
      height: 0.5px;
      background-color: $apricot;
    }
    &::before {
      left: 1px;
      margin-right: 8px;
    }
    &::after {
      right: 1px;
      margin-left: 8px;
    }
    &.left {
      &::before { width: 16px; }
      &::after { flex: 1; }
    }
    &.right {
      &::before { flex: 1; }
      &::after { width: 16px; }
    }
  }

  .message {
    line-height: 1.2em;
  }
}
</style>
