<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px;">
      <!-- 展示已有SPU数据 -->
      <div v-show="scene == 0">
        <!-- 测试自定义指令->按钮权限 -->
        <el-button @click="addSpu" :disabled="categoryStore.c3Id ? false : true" type="primary" size="default"
          icon="Plus"  v-buttonShow="`btn.Spu.add`"> 添加SPU</el-button>
        <el-table style="margin: 10px 0px;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click=addSku(row) ></el-button>
              <el-button type="primary" size="small" icon="Edit" title="编辑SPU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="small" icon="InfoFilled" title="查看SKU" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout=" prev, pager, next, jumper ,->,sizes,total" :total="total"
          @current-change="getHasSpu" @size-change="changeSize" />
      </div>
      <!-- 添加SPU|修改SPU/子组件 -->
      <spuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></spuForm>
      <!-- 添加SKU子组件 -->
      <skuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></skuForm>
      <!-- dialog对话框：展示已有的SKU数据 -->
      <el-dialog title="SKU列表" v-model="dialogShow">
        <el-table :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch ,onBeforeMount} from 'vue';
// 引入分类仓库
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu';
import type { HasSpuResponseData, Records, SkuInfoData, SkuData } from '@/api/product/spu/type';
//引入子组件
import spuForm from './spuForm.vue';
import skuForm from './skuForm.vue';
import type { SpuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

// 定义分类仓库
let categoryStore = useCategoryStore();
// 场景的数据
let scene = ref<number>(0)  //0：显示已有SPU数据 1：添加或者修改已有SPU的结构 2：添加SKU的结构
// 分页器默认页码
let pageNo = ref<number>(1);
// 每一页展示几条数据
let pageSize = ref<number>(3);
// 存储三级分类下的SPU数据
let records = ref<Records>([]);
// 存储已有SPU总个数
let total = ref<number>(0);
// 获取子组件spuForm实例
let spu = ref<any>();
// 获取子组件skuForm实例
let sku = ref<any>();
// 存储全部的SKU数据
let skuArr = ref<SkuData[]>([]);
// 查看SKU-diglog对话框的显示与隐藏
let dialogShow = ref<boolean>(false);

// 监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {

  if (!categoryStore.c3Id) {
    // console.log('c3ID失败');
    return
  }
  // console.log('categoryStore.c3Id获取成功', categoryStore.c3Id);
  getHasSpu();
})

// 此方法执行：可以获取某一个三级分类下全部已有的SPU
const getHasSpu = async (pager = 1) => {
  // 修改当前页面
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
  // console.log('拿到数据', result);

  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu();
}

// 添加SPU按钮方法->scene=1
const addSpu = () => {
  // 切换添加|修改SPU结构->scene=1
  scene.value = 1;
  spu.value.initAddSpu(categoryStore.c3Id);
}

// 子组件spuForm绑定自定义事件：目前是让子组件通知父组件切换为场景0->scene=0
const changeScene = (obj: any) => {
  //子组件spuForm点击取消按钮场景变为0：展示已有SPU->scene=0
  scene.value = obj.flag;
  // 再次发送请求获取全部的SPU
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
    // console.log('添加');

  }
}

// 编辑按钮修改已有的SPU属性->scene=1
const updateSpu = (row: SpuData) => {
  scene.value = 1;
  // 给子组件spuform传递获取的数据
  spu.value.initHasSpuData(row);
}

// 添加SKU按钮的回调
const addSku = (row: SpuData) => {
  // 点击添加SKU按钮切换场景为2
  scene.value = 2
  // 调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuDta(categoryStore.c1Id, categoryStore.c2Id, row);
}

// 查看SKU列表数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList((row.id as number));
  if (result.code == 200) {
    skuArr.value = result.data;
    //查看SKU-diglog对话框的显示
    dialogShow.value = true;
  }
}

// 删除SPU方法
const deleteSpu = async (row: SpuData) => {
  let result = await reqRemoveSpu((row.id as number))
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 获取剩余的SPU属性
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
// 路由组件销毁前，清空仓库关于分类的数据
onBeforeMount(()=>{
categoryStore.$reset();
})
</script>

<style scoped></style>