<template>
  <Error class="e404-vue">Page not found!</Error>
</template>

<script>
import Error from '@/components/Error.component';

export default {
  name: '404View',
  components: { Error },
};
</script>

<style lang="scss">
.view.e404-vue {
  margin-top: 0 !important;
}
</style>
