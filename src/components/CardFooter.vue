<template>
  <footer class="cs-footer">
    <section>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </section>
    <div></div>
    <section>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </section>
  </footer>
</template>

<script setup lang="ts">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.cs-footer {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;

  >section {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    transform: skew(20deg);

    >div {
      height: 6px;
      width: 6px;
      transform-origin: bottom;
      // margin-left: 4px;

    }

    >div:nth-of-type(1) {
      background-color: rgb(45, 128, 194);
    }

    >div:nth-of-type(2) {
      // background-color: #4bcadb;
      background-color: rgba(45, 128, 194, 0.8);
      transform: scale(.9);

    }

    >div:nth-of-type(3) {
      // background-color: #5b94a7;
      background-color: rgba(45, 128, 194, 0.6);
      transform: scale(.8);
    }

    >div:nth-of-type(4) {
      // background-color: #425b6f;
      background-color: rgba(45, 128, 194, 0.4);
      transform: scale(.7);
    }
  }
  >div{
    height: 2px;
    flex-grow: 1;
    background: linear-gradient(90deg,transparent 0,#2d80c2 50%,transparent 100%);
  }

}
</style>
