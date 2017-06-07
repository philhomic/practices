<template>
  <transition name="move">
    <div v-show="showFlag" class="food">

    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false
      };
    },
    methods: {
      show () {
        this.showFlag = true;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
  .move-enter-active, .move-leave-active
    transition: all .5s
  .move-enter, .move-leave-active
    transform: translate3d(100%, 0, 0);
</style>
