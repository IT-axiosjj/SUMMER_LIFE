<template>
  <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="code" label="权限值"></el-table-column>
    <el-table-column prop="updateTime" label="修改时间"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button @click="addPermission(row)" type="primary" size="default" :disabled="row.level == 4 ? true : false">{{
          row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
        <el-button @click="updatePermission(row)" type="primary" size="default"
          :disabled="row.level == 1 ? true : false">编辑</el-button>
          <!-- 气泡确认框 -->
        <el-popconfirm :title="`你确定要删除${row.name}?`" width="260px" @confirm="removeMenu(row.id)">
          <template #reference>
            <el-button type="primary" size="default" :disabled="row.level == 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框：添加菜单与编辑菜单 -->
  <el-dialog v-model="dialog" :title="menuData.id ? '编辑菜单' : '添加菜单'">
    <!-- 表单组件：收集新增与已有的菜单的数据 -->
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
// 引入获取菜单请求API
import { reqRemoveMenu,reqAllPermission, reqAddOrUpdateMenu } from '@/api/acl/menu';
// 引入ts类型
import type { MenuParams, Permission, PermissionResponseData, PermissionList } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';

// 存储菜单的数据
let PermissionArr = ref<PermissionList>([]);
// 控制dialog显示与隐藏
let dialog = ref<boolean>(false);
//携带的参数
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

// 组件挂载完毕
onMounted(() => {
  getHasPermission();
})

// 获取菜单数据的方法
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission();
  if (result.code == 200) {
    PermissionArr.value = result.data
  }
}

// 添加按钮回调
const addPermission = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialog.value = true;
  // 收集新增的菜单的level数值
  menuData.level = row.level + 1;
  // 给谁新增子菜单
  menuData.pid = (row.id as number);
}

// 编辑按钮回调
const updatePermission = (row: Permission) => {
  dialog.value = true;
  //点击修改按钮：收集已有的菜单的数据进行更新
  Object.assign(menuData, row);
}

// 确定按钮
const save = async () => {
  let result: any = await reqAddOrUpdateMenu(menuData);
  if (result.code == 200) {
    // 关闭对话框
    dialog.value = false;
    // 提示信息
    ElMessage({
      type: 'success',
      message: menuData.id ? '修改成功' : '添加成功'
    })
    // 再次获取全部最新的菜单的数据
    getHasPermission();

  }
}

// 删除按钮回调
const removeMenu = async(id:number) =>{
let result :any = await reqRemoveMenu(id);
if(result.code ==200){
  ElMessage({
    type:'success',
    message:'删除成功'
  })
  // 再次获取全部菜单
  getHasPermission();
}
}
</script>

<style scoped></style>