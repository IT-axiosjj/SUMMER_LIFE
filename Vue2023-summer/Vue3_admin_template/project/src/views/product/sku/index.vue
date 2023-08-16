<template>
  <el-card>
    <el-table border style="margin: 10px 0px;" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="描述" prop="skuDesc" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="图片" align="center">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" align="center"></el-table-column>
      <el-table-column label="价格(元)" prop="price" align="center" width="150px"></el-table-column>
      <el-table-column label="操作" width="300px" fixed="right">
        <template #="{ row }">
          <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'" @click="updateSale(row)">
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="editSku"> </el-button>
          <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"> </el-button>
          <el-popconfirm :title="`你确定删除${row.skuName}?`" width="200px" @confirm="removeSku(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"> </el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total " :total="total" @current-change="getHasSku"
      @size-change="changeSize" />
    <!-- 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>

    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引入请求
import { redDeleteSku, reqSkuList, reqSaleSku, reqOnSaleSku, reqSkuInfo } from '@/api/product/sku';
import type { SkuInfoData, SkuData, SkuResponseData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';

// 分页器当前页面
let pageNo = ref<number>(1);
// 每一页展示几条数据
let pageSize = ref<number>(10);
let total = ref<number>(0);
// 存储SKU数据
let skuArr = ref<SkuData[]>([]);
//商品详情展示--- 抽屉的显示与隐藏
let drawer = ref<boolean>(false);
// 存储商品详情数据
let skuInfo = ref<any>({});


// 组件挂载完毕加载SKU数据
onMounted(() => {
  getHasSku();
})

const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager;
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  // console.log('SKU数据',result);

  if (result.code == 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
    // console.log('skuArr数据',skuArr);
  }
}

// 页码变换
// const changePageNo =(num:number)=>{
//   pageNo.value = num;
//   getHasSku();

// }

//每页展示多少条数据
const changeSize = () => {
  getHasSku();
}

// 商品的上架与下架方法
const updateSale = async (row: SkuData) => {
  // if:isSale==1,说明当前商品是上架状态--->更新为下架
  // else:isSale==0，否则说明当前商品是下架状态--->更新为上架
  if (row.isSale == 1) {
    // 下架操作
    await reqOnSaleSku((row.id as number))
    //提示信息
    ElMessage({
      type: 'info',
      message: '下架成功'
    })
    // 发送请求获取当前更新完毕的全部已有的SKU
    getHasSku();
  } else {
    // 上架架操作
    await reqSaleSku((row.id as number))
    //提示信息
    ElMessage({
      type: 'success',
      message: '上架成功'
    })
    // 发送请求获取当前更新完毕的全部已有的SKU
    getHasSku();
  }

}

//编辑SKU
const editSku = () => {
  ElMessage({
    type: 'info',
    message: '此功能还未上架'
  })
}

// 查看商品详情按钮回调
const findSku = async (row: SkuData) => {
  // 展示抽屉
  drawer.value = true;
  //获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo((row.id as number))
  skuInfo.value = result.data;
}

// 删除某一个商品
const removeSku = async (id: number) => {
  let result: any = await redDeleteSku(id);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 获取删除成功后的全部已有商品
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }else{
    ElMessage({
      type: 'error',
      message: '系统数据不能删除'
    })
  }

}
</script>

<style scoped lang="scss">
.el-row {
  margin: 10px 0px;

  .el-tag {
    margin: 5px;
  }
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>