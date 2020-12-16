<template>
  <div class="e404-vue">
    <span class="message"><Icon name="warning" />Page not found!</span>
  </div>
</template>

<script>
import Icon from '@/components/Icon.component';

export default {
  name: '404View',
  components: { Icon },
};
</script>

<style lang="scss">
.view.e404-vue {
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
</style>
