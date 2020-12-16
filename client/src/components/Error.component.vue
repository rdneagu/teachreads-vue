<template>
  <div class="e404">
    <span class="message"><Icon name="warning" /><slot /></span>
  </div>
</template>

<script>
import Icon from './Icon.component';

export default {
  name: 'ErrorComponent',
  components: { Icon },
};
</script>

<style lang="scss">
.e404 {
  position: absolute;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  .message {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border: 1px solid $error;
    border-radius: 4px;
    background-color: rgba($error, .2);
    color: lighten($error, 20%);
    font-weight: 700;
    font-size: 1.6em;

    .icon-vue .icon {
      font-size: 1.5em;
      margin-right: 20px;
    }
  }
}
</style>
