<template>
  <div class="hello">
    <div id="lottie_box"></div>
    <button @click="controle">{{status == 1 ? '播放' : '暂停'}}</button>
  </div>
</template>

<script>
import lottie from 'lottie-web';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      lottie: {},
      status: 0
    }
  },
  methods: {
    controle() {
      this.status = this.status == 1 ? 0 : 1;

      if(this.status == 1) {
        this.lottie.pause();
      }else{
        this.lottie.play();
      }
    }
  },
  mounted() {
    // path: 'https://labs.nearpod.com/bodymovin/demo/markus/halloween/markus.json'

    this.lottie = lottie.loadAnimation({
      container: document.getElementById('lottie_box'),
      renderer: 'svg',
      loop: true,
      path: '/demo.json',
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  #lottie_box{
    width: 500px;
    height: 500px;
    border: 1px solid red;
  }
</style>
