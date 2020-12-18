<template>
  <div v-if="isCondition" class="input-vue" :class="[ hasFailed ]">
    <div class="inner-input">
      <label v-if="label" :for="getId" class="label">{{ label }}</label>
      <textarea v-if="isTextarea" :id="getId" :name="getId" :placeholder="placeholder" rows="3" v-model="model" :maxlength="maxlength" />
      <input v-else :id="getId" :name="getId" :type="getInputType" :placeholder="placeholder" v-model="model" :maxlength="maxlength" />
      <span v-if="maxlength" class="input-limit">{{ getCharLimit }}</span>
    </div>
    <Icon v-if="error" class="error" name="warning" v-tooltip="{ type: 'alert', text: error }"></Icon>
  </div>
</template>

<script>
import Icon from '@/components/Icon.component';

export default {
  name: 'InputComponent',
  components: { Icon },
  props: ['id', 'label', 'type', 'maxlength', 'placeholder', 'value', 'error', 'condition'],
  emits: ['update:value'],
  computed: {
    getId() {
      return (this.id) ? `input-${this.id}` : null;
    },
    hasFailed() {
      return (this.error) ? 'failed' : null;
    },
    getInputType() {
      return this.type || 'text';
    },
    getCharLimit() {
      return (this.maxlength) ? `Remaining characters: ${this.maxlength - this.value.length}` : null;
    },
    isTextarea() {
      return (this.getInputType === 'textarea');
    },
    isCondition() {
      if (typeof (this.condition) !== 'function') return true;
      return this.condition();
    },
    model: {
      get() {
        return this.value;
      },
      set(value) {
        if (this.maxlength && value.length > this.maxlength) {
          value = value.substring(0, this.maxlength);
        }
        this.$emit('update:value', value);
      },
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins';

@keyframes fxerror { 0% { opacity: 0; } 50% { opacity: 1; color: lighten($error, 10%); } 100% { color: $error; } }

.input-vue {
  position: relative;
  display: flex;
  margin: 10px 0;
  &:nth-child(1) { margin-top: 20px; }
  &:nth-child(2) { margin-bottom: 20px; }
  .inner-input {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 6px 4px;
    background-color: rgba($apricot, .1);
    border: 1px solid $apricot;
    border-top: none;
    border-radius: 4px;
    label {
      display: flex;
      position: absolute;
      font-size: 10px;
      font-weight: 700;
      left: 0; right: 0; top: -4px;
      &::before, &::after {
        content: "";
        position: relative;
        top: 4px;
        height: 0.5px;
        background-color: $apricot;
      }
      &::before {
        width: 16px;
        left: 2px;
        margin-right: 8px;
      }
      &::after {
        flex: 1;
        right: 2px;
        margin-left: 8px;
      }
      @include disable-select();
    }
    input, textarea {
      position: relative;
      flex: 1;
      font-weight: 600;
      @include set-placeholder($apricot);
      z-index: 1;
    }
    textarea {
      resize: none;
      min-height: 20px;
    }
    .input-limit {
      position: absolute;
      bottom: 2px; right: 2px;
      font-family: 'Open Sans';
      font-size: 10px;
      font-weight: 600;
      color: rgba($apricot, .4);
      @include disable-select();
    }
  }
  .error {
    display: flex;
    align-self: center;
    padding: 0 4px;
    color: $error;
    font-size: 18px;
    animation: .4s fxerror ease-in-out;
  }
}

// .input-wrapper {
//   display: grid;
//   &.icon-label {
//     grid-template-columns: 40px 1fr auto;
//     grid-template-rows: min(30px);
//     grid-template-areas: "label field error";
//   }
//   &.text-label {
//     grid-template-columns: 1fr auto;
//     grid-template-rows: auto minmax(30px, auto);
//     grid-template-areas: "label ."
//                          "field error";
//   }

//   .label, .error {
//     display: flex;
//     align-items: center;
//     padding: 8px;
//     font-size: 16px;
//   }
//   .error { grid-area: error; }
//   .label {
//     grid-area: label;
//     display: flex;
//   }
//   &.text-label .label {
//     color: $color-cyan;
//     font-weight: 600;
//   }
//   &.icon-label .label {
//     justify-content: center;
//     padding: 0 12px;
//     border-radius: 2px 0 0 2px;
//     background-color: darken($color-cyan, 15%);
//     color: lighten($color-cyan, 30%);
//   }
//   input, textarea {
//     grid-area: field;
//     min-width: 50px;
//     padding: 0 20px;
//     border-radius: 2px;
//     color: $color-cyan;
//     border: 1px solid darken($color-cyan, 15%);
//     @include transition('background-color, text-shadow, box-shadow, border-color', 200ms, ease);
//     &:hover { background-color: rgba($color-cyan, .1); }
//     &:focus {
//       background-color: rgba($color-cyan, .1);
//       box-shadow: 0 0 3px lighten($color-cyan, 10%) inset;
//       text-shadow: 0 0 2px $color-cyan;
//     }
//     line-height: 1;
//   }
//   textarea {
//     min-height: 16px;
//     resize: vertical;
//     padding: 10px 20px;
//   }
//   &.icon-label input {
//     border-left: none;
//     border-radius: 0 4px 4px 0;
//   }
//   // If input field has failed the validation checks styling below applies
//   &.failed:not(#prioritize) {
//     .label {
//       color: lighten($redish, 30%);
//       border-color: $redish;
//       background-color: $redish;
//     }
//     .error {
//       font-size: 20px;
//       color: $redish;
//       animation: .4s fxerror ease-in-out;
//     }
//     input, textarea {
//       @include setPlaceholder($redish);
//       color: $redish;
//       border-color: $redish;
//       &:hover { background-color: rgba($redish, .1); }
//       &:focus {
//         background-color: rgba($redish, .1);
//         box-shadow: 0 0 3px lighten($redish, 10%) inset;
//         text-shadow: 0 0 2px $redish;
//       }
//       &::selection {
//         background-color: $redish;
//       }
//     }
//   }
// }
</style>
