<template>
  <header class="cs-header">
    <div><span>
        <slot>标题</slot>
      </span></div>
    <div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </header>
</template>

<script setup lang="ts">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.cs-header {
  height: 50px;
  width: 100%;
  background: rgba(50, 91, 172, 0.7);
  display: flex;
  // justify-content: center;
  align-items: center;
  // border-bottom: 1px solid #759ebc;

  >div:nth-of-type(1) {
    position: relative;
    padding: 0.2em;
    margin-left: 1em;
    background: linear-gradient(120deg, #2894ef, #1d59a2);
    clip-path: polygon(0 5px, 5px 0, 100% 0, 95% 100%, 0 100%);

    >span {
      display: inline-block;
      transform: skew(-8deg);
      font-weight: 900;
      font-family: sans-serif;
      margin:0 1em;
      color: #fff;
    }

    &::before {
      content: "";
      width: 6px;
      height: 6px;
      position: absolute;
      border-left: 1px solid #fff;
      transform: rotate(45deg);

    }
  }

  >div:nth-of-type(2) {
    width: 42px;
    height: 16px;
    margin-left: .5em;
    transform: skew(-13deg);
    display: flex;
    justify-content: space-around;

    >div {
      height: 100%;
      width: 4px;

    }

    >div:nth-of-type(1) {
      background-color: #0e99dc;
    }

    >div:nth-of-type(2) {
      background-color: #1187c7;
    }

    >div:nth-of-type(3) {
      background-color: #267cc5;
    }

    >div:nth-of-type(4) {
      background-color: #1f6aae;
    }

    >div:nth-of-type(5) {
      background-color: #1b5992;
    }

    >div:nth-of-type(6) {
      background-color: #225283;
    }
  }
}
</style>
