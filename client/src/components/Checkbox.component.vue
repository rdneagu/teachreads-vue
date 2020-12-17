<template>
  <div v-if="isCondition" class="checkbox-vue">
    <input :id="getId" :name="getId" type="checkbox" v-model="model">
    <label :for="getId"><slot />{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'CheckboxComponent',
  props: ['id', 'label', 'selected', 'condition'],
  emits: ['update:selected'],
  computed: {
    getId() {
      return (this.id) ? `checkbox-${this.id}` : null;
    },
    isCondition() {
      if (typeof (this.condition) !== 'function') return true;
      return this.condition();
    },
    model: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit('update:selected', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_mixins.scss';

.checkbox-vue {
  position: relative;
  display: flex;
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    @include transition('color, text-shadow', .2s, ease);
    &:hover {
      color: lighten($apricot, 20%);
      text-shadow: 0 0 1px $apricot;
    }
    &:before {
      position: relative;
      content: $icon-check;
      margin-right: 5px;
      border: 2px solid $apricot;
      border-radius: 2px;
      font-family: 'techreads-ico';
      color: rgba($apricot, 0);
      text-shadow: none;
      @include transition('color', .15s, ease);
    }
    @include disable-select();
  }

  input {
    position: absolute;
    display: none;
    visibility: hidden;
    &:checked + label:before {
      color: $apricot;
      text-shadow: none;
    }
  }
}
</style>
