<template>
  <div class="box">
    <img src="../../assets/images/error_images/404-02.png" alt="">
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter();
const goHome = () =>{
  $router.push('/');
}
</script>

<style scoped lang="scss">
.box{
  width:100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  img{
    width: 800px;
    height: 800px;
   margin-top: -80px;
  }
  button{
    width: 100px;
    height: 30px;
    border-radius: 10px;
    background-color: #F79B9A;
    border-color: #F79B9A;
    color: white;
  }
}
</style>