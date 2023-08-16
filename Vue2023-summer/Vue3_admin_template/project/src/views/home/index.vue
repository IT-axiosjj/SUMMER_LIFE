<template>
  <el-card >
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avator">
    <div class="bottom">
      <h3 class="title"> {{ getTime() }}好,{{ userStore.username }}</h3>
      <p class="subtitle">小邓暑期项目联系</p>
    </div>
    </div>

  </el-card>
  <div class="footer">
    <SvgIcon name="welcome" width="700px" height="700px"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
// 引入组合式API函数之生命周期函数
import { onMounted } from 'vue';
// 获取仓库,获取用户名和用户头像
import useUserStore from '@/store/modules/user';
// 引入获取时间方法
import { getTime } from '@/utils/time';
let userStore = useUserStore();
onMounted(() => {
  userStore.userInfo();
})
</script>

<style scoped lang="scss">
.box{
  display:flex ;
  justify-content:left;
  align-items: center;
  .avator{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom{
    margin-left: 20px;
    .title{
      font-size:30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle{
      font-style: italic;
      color: rgb(197, 190, 190);
    }
  }
}.footer{
  display: flex;
  justify-content: center;
}
</style>