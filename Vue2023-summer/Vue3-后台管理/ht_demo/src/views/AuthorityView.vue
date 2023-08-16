<template>
  <div>
    <el-tree
      ref="treeRef"
      :data="list"
      show-checkbox
      node-key="roleId"
      :check-strictly="true"
      :default-checked-keys="authority"
      :props="defaultProps"
    />
    <el-button @click="changeAuthority">确认修改</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { InitData } from "../type/authority";
import { getAuthorityList } from "../request/api";
export default defineComponent({
  setup() {
    const route = useRoute();
    const params: any = route.params;
    const data = reactive(new InitData(params.id, params.authority));
    onMounted(() => {
      getAuthorityList().then((res) => {
        data.list = res.data;
      });
    });
    const changeAuthority = () => {
      console.log(
        data.treeRef.getCheckedKeys().sort(function (a: number, b: number) {
          return a - b;
        })
      );

      // 传给后台，后台进行修改
    };
    const defaultProps = {
      children: "roleList",
      label: "name",
    };
    return { ...toRefs(data), changeAuthority, defaultProps };
  },
});
</script>

<style scoped></style>