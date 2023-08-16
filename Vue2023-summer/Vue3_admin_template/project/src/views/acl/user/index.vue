<template>
  <el-card style="height: 80px;">
    <el-form class="form">
      <el-form-item label="用户名" :inline="true">
        <el-input placeholder="请输入搜素的用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="defailt" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" size="defailt" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

  </el-card>
  <el-card style="margin:10px 0px">
    <el-button type="primary" size="defailt" @click="addUser">添加用户</el-button>
    <el-button type="primary" size="defailt" @click="deleteSelectUser"
      :disabled="selectIdArr.length ? false : true">批量删除</el-button>
    <el-table style="margin: 10px 0px;" border :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="350px">
        <template #="{ row }">
          <el-button type="primary" size="defailt" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="primary" size="defailt" icon="Edit" @click="update(row)">编辑</el-button>

          <el-popconfirm :title="`你确定删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="defailt" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout=" prev, pager, next, jumper ,->,sizes, total" :total="total" @current-change="getHasUser"
      @size-change="sizeChange" />
  </el-card>
  <!-- 抽屉 :添加|更新用户结构-->
  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请填写用户名字" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请填写用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请填写用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉：分配角色结构 -->
  <el-drawer v-model="drawer1" direction="rtl">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <!-- 显示角色的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="roleConfirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import useLayOutSettingStore from '@/store/modules/setting';
import { reqRemoveUser, reqSelectUser, reqAllRole, reqUserInfo, reqAddOrUpdateUser, reqSetUserRole } from '@/api/acl//user';
import type { SetRoleData, AllRole, AllRoleResponseData, UserResponseData, Records, User } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
// 分页器当前页面
let pageNo = ref<number>(1);
// 每一页展示几条数据
let pageSize = ref<number>(10);
// 用户总个数
let total = ref<number>(0);
// 存储全部用户的数组
let userArr = ref<Records>([]);
// 抽屉显示与隐藏---添加|更新用户
let drawer = ref<boolean>(false)
// 抽屉显示与隐藏---分配角色
let drawer1 = ref<boolean>(false)
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 获取form组件实例
let formRef = ref<any>();
// 存储全部职位的数据
let allRole = ref<AllRole>([]);
// 存储当前用户已有职位的数据
let userRole = ref<AllRole>([]);
// 全选复选框收集数据：是否全选
let checkAll = ref<boolean>(false);
// 设置不确定状态，仅负责样式控制	
let isIndeterminate = ref<boolean>(true);
// 存储批量删除的用户的ID
let selectIdArr = ref<User[]>([]);
// 定义响应式数据：收集用户输入进来的关键字
let keyword = ref<string>('');
// 获取setting仓库
let settingStore = useLayOutSettingStore();

// 组件挂载
onMounted(() => {
  getHasUser();
})

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager;
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
  if (result.code == 200) {
    total.value = result.data.total;
    userArr.value = result.data.records;
  }
}

// 分页器下拉菜单的自定义事件
const sizeChange = () => {
  getHasUser();
}

// 添加用户方法
const addUser = () => {
  // 显示抽屉效果
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次错误的校验提示信息
  nextTick(() => {
    formRef.value.clearValidate('username');
    formRef.value.clearValidate('name');
    formRef.value.clearValidate('password');
  })
}

// 更新已有用户方法
// row：为用户的账号信息
const update = (row: User) => {
  // 显示抽屉效果
  drawer.value = true
  // 收集更新的数据
  Object.assign(userParams, row);
  // 清除上一次错误的校验提示信息
  nextTick(() => {
    formRef.value.clearValidate('username');
    formRef.value.clearValidate('name');
    formRef.value.clearValidate('password');
  })
}


// 确定按钮回调
const confirmClick = async () => {
  // 点击确定按钮，必须保证表单全部符合条件再去发送请求
  await formRef.value.validate();
  let result = await reqAddOrUpdateUser(userParams);
  if (result.code == 200) {
    // 关闭抽屉
    drawer.value = false;
    // 提示信息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    // 获取最新的全部账号信息
    getHasUser(userParams.id ? pageNo.value : 1);
    // 浏览器自动刷新一次
    window.location.reload();
  } else {
    // 关闭抽屉
    drawer.value = false;
    // 提示信息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
    })
  }
}

// 取消按钮回调
const cancelClick = () => {
  // 关闭抽屉效果
  drawer.value = false;
}

// 自定义校验用户名字方法
// @ts-ignore
const validatorUsername = (rule: any, value: any, callback: any) => {
  // 用户名字长度至少五位
  if (value.trim().length >= 5) {
    callback();
  } else {
    callback(new Error('用户名字至少五位'))
  }
}

// 自定义校验用户昵称方法
// @ts-ignore
const validatorName = (rule: any, value: any, callback: any) => {
  // 用户名字长度至少五位
  if (value.trim().length >= 5) {
    callback();
  } else {
    callback(new Error('用户昵称至少五位'))
  }
}

// 自定义校验用户昵称方法
// @ts-ignore
const validatorPassword = (rule: any, value: any, callback: any) => {
  // 用户名字长度至少五位
  if (value.trim().length >= 6) {
    callback();
  } else {
    callback(new Error('用户密码至少六位'))
  }
}

// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  // 用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 分配角色按钮回调
const setRole = async (row: User) => {

  // 存储已有的用户信息
  Object.assign(userParams, row);
  let result: AllRoleResponseData = await reqAllRole((userParams.id as number));
  if (result.code == 200) {
    // 存储全部的职位数据
    allRole.value = result.data.allRolesList;
    // 存储当前用户已有的职位数据
    userRole.value = result.data.assignRoles;
    // 分配角色构造显示
    drawer1.value = true;
  }
}
// 当绑定值变化时触发的事件---全选复选框
const handleCheckAllChange = (val: boolean) => {
  // val :true(全选)| false(不全选)
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}


// 底部复选框change事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 已经勾选的项目长度
  const checkedCount = value.length;
  // 勾选上的职位个数与全部的职位个数相等，顶部的全选复选框勾上
  checkAll.value = checkedCount === allRole.value.length
  // 顶部复选框不确定的样式(三种写法)
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
  // isIndeterminate.value = !(checkedCount === allRole.value.length);
  // isIndeterminate.value = value.length != allRole.value.length
}

// 确定按钮---分配角色
const roleConfirm = async () => {
  // 手机数据
  let data: SetRoleData = {
    userId: (userParams.id as number),
    roleIdList: userRole.value.map(item => {
      return (item.id as number)
    })
  }

  // 分配角色
  let result: any = await reqSetUserRole(data);
  if (result.code == 200) {
    // 提示信息
    ElMessage({
      type: 'success',
      message: '角色分配成功'
    })
    // 关闭抽屉
    drawer1.value = false;
    // 获取更新完毕用户的信息，更新完毕留在当前页
    getHasUser(pageNo.value);
  }
}

// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
}

// table复选框勾选时触发事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}

// 批量删除按钮回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  let idsList: any = selectIdArr.value.map(item => {
    return item.id
  })
  // 批量删除请求
  let result: any = await reqSelectUser(idsList);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功'
    });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
}

// 搜索按钮回调
const search = () => {
  // 根据关键字获取相应的用户数据
  getHasUser();
  // 清空关键字
  keyword.value = '';
}

// 重置按钮回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh

  
}
// 测试复选框
// // 全选复选框收集数据：是否全选
// let checkAll = ref<boolean>(false);
// let allRole = ref(['销售', '秋儿', '老板', '前台'])
// let uesrRole = ref(['秋儿'])
// // 设置不确定状态，仅负责样式控制
// let isIndeterminate = ref<boolean>(true);

</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>