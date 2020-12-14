<template>
  <Background />
  <Header />
  <router-view class="view" />
</template>

<script>
import Background from '@/components/Background.component';
import Header from '@/components/Header.component';

export default {
  components: { Background, Header },
};
</script>

<style lang="scss">
@import '@/scss/_reset';
@import '@/scss/_normalize';
@import '@/scss/_fonts';

html, body, #app {
  display: flex;
  flex: 1;
  min-height: 100vh;
}

#app {
  flex-direction: column;
  background-color: $old-lavender;
  color: $apricot;
  font-family: Raleway, Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .view {
    position: relative;
    display: flex;
    flex: 1;
    margin-top: 83px;
  }
}

input, textarea {
  border: none;
  background: none;
  outline: none;
  overflow: hidden;
  color: $apricot;
}

a {
  color: inherit;
  outline: none;
  text-decoration: inherit;
  transition: color .2s ease;

  &/*:not(.router-link-active)*/:hover {
    color: lighten($apricot, 20%);
    text-shadow: 0 0 1px $apricot;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
