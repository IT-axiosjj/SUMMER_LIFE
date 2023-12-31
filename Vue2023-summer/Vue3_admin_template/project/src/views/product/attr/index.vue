<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px;">
      <div v-show="scene == 0">
        <el-button @click="addAttr" type="primary" size="default" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
        <el-table border style="margin:10px 0px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag style="margin:5px" v-for="(item) in row.attrValueList" :key="item.id"> {{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
             
              <el-popconfirm :title="`您确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene == 1">
        <!--  展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请您输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" type="primary" size="default" icon="Plus"
          :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)" size="small"
                placeholder="请您输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ index }">
              <el-button type="danger" size="small" icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="save" type="primary" size="default"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick ,onBeforeMount} from 'vue';
// 引入获取已有属性与属性接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
// 获取分类的仓库
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';

// 准备一个空数组，存储相对应的组件实例el-input
let inputArr = ref<any>([]);
// 收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '',//新增属性的名字
  attrValueList: [],//新增属性的属性值数组
  categoryId: '',//三级分类的ID
  categoryLevel: 3,//代表的是三级分类
})
let categoryStore = useCategoryStore();
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([]);
// 定义card组件内容切换变量
let scene = ref<number>(0);//scene=0->显示table,scene=1->显示添加与修改属性结构

// 监听分类仓库
watch(() => categoryStore.c3Id, () => {
  // 清空上一次查询的属性与属性值
  attrArr.value = [];
  // 保证三级分类得有才能发送请求
  if (!categoryStore.c3Id) return;
  getAttr();


})
// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  // 获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
    console.log(attrArr);
  }
}

//  scene->0添加属性按钮回调
const addAttr = () => {
  // 每一次点击添加按钮时清空一下数组数据再收集数据
  Object.assign(attrParams, {
    attrName: '',//新增属性的名字
    attrValueList: [],//新增属性的属性值数组
    categoryId: categoryStore.c3Id,//三级分类的ID // 点击添加按钮收集三级分类的ID
    categoryLevel: 3,//代表的是三级分类
  })

  // 切换添加与修改属性结构
  scene.value = 1;


}

// 修改属性按钮回调
const updateAttr = (row: Attr) => {
  // 切换添加与修改属性结构
  scene.value = 1;
  // 将已有的属性对象赋值给attrParams
  // ES6->Object.assign进行合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}

// 取消按钮的回调
const cancel = () => {
  // 切换添加与修改属性结构
  scene.value = 0;
}

// scene->1添加属性值按钮回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,//控制每一个属性值的编辑模式与切换模式
  })
  // 获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  })
}

//scene->1 保存按钮回调
const save = async () => {
  // 发送请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 切换场景
    scene.value = 0;
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    });
    // 获取全部已有属性与属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}

// 编辑模式切换查看模式方法
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断1
  if (row.valueName.trim() == '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
  }
  // 非法判断2
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      // 切记把当前失去焦点属性值对象从当前数组扣除判断
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 删除重复属性值
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '当前添加属性值存在重复现象'
    })
    return
  }
  // 相应的属性值对象flag,变为false,展示div
  row.flag = false
}

//查看模式切换编辑模式方法
const toEdit = (row: AttrValue, $index: number) => {

  // 相应的属性值对象flag,变为true,展示input
  row.flag = true

  // nextTick:响应式数据发生变化，获取更新的DOM（组件实例）
  nextTick(() => {
    inputArr.value[$index].focus();
  })
}

// 删除某一属性方法
const deleteAttr = async (attrId: number) => {
  //发送相应的删除已有的属性的请求
  let result = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 获取一次已有属性与属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

// 路由组件切换后，仓库分类相关的数据清空
onBeforeMount(()=>{
  // 清空仓库数据
  categoryStore.$reset();
})
</script>

<style scoped></style>