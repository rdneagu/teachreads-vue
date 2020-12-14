<template>
  <div class="background-vue" />
</template>

<style lang="scss" scoped>
.background-vue {
  position: fixed;
  left: 0; top: 0;
  width: 100%; height: 100%;
  background: url(../assets/images/bg.jpg) no-repeat center center / cover;
  opacity: .8;
  z-index: 0;

  &:after {
    content: '';
    position: fixed;
    left: 0; top: 0;
    width: 100%; height: 100%;
    background-color: rgba(black, .8);
    z-index: 1;
  }
}
</style>
