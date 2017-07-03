<template>
  <span v-bind:class="[className]">{{ time | boardTime }}</span>
</template>

<script>

  export default {
    props: {
      time: {
        type: Number,
        default: 60*3
      },
      className:{
        default: 'flat-text-board-timer'
      }
    },
    filters: {
      boardTime (s) {
        var min = parseInt(s / 60)
        var segs = s % 60
        return ('0' + min).slice(-2) + ':' + ('0' + segs).slice(-2)
      }
    }
  }
</script>
