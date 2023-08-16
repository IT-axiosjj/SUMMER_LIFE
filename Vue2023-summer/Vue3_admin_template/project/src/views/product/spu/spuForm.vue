<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option :label="item.tmName" v-for="(item) in AllTradeMark" :key="item.id" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入描述" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- 
        v-model:file-list->展示默认图片
        action->上传图片的接口地址
         list-type->文件列表类型
       -->
      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :before-upload="handlerUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
      </el-dialog>
    </el-form-item>
    <!-- 展示销售属性 -->
    <el-form-item label="SPU销售属性">
      <!-- 下拉菜单 -->
      <el-select v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
        <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
          :label="item.name"></el-option>
      </el-select>
      <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;"
        type="primary" size="default" icon="Plus">添加属性</el-button>
      <!-- 销售属性与属性值 -->
      <el-table border style="margin: 10px 0px;" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="120px"></el-table-column>
        <el-table-column label="属性名" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row }">
            <el-tag @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin: 0px 10px;"
              v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" class="mx-1" closable>
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true" placeholder="请你输入属性值"
              type="small" width="100px"></el-input>
            <el-button v-else @click="toEdit(row)" type="primary" size="small" icon="Plus"> </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{  $index }">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"> </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">消失</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">

import type { SaleAttrValue, SpuData, HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { reqAddOrUpdateSpu, reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';


let $emit = defineEmits(['changeScene']);
// 全部品牌的数据
let AllTradeMark = ref<Trademark[]>([]);
// 商品图片
let imgList = ref<SpuImg[]>([]);
// 已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([]);
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '',//收集三级分类的ID
  spuName: '',//SPU的名字
  description: '',//SPU的描述
  tmId: '',//品牌的ID
  spuImageList: [],
  spuSaleAttrList: []
});
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
// 存储预览图片地址
let dialogImageUrl = ref<string>('');
// 将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('');

// 点击取消按钮：通知父组件切换场景为0，展示SPU的数据->scene=0
const cancel = () => {
  $emit('changeScene', {flag:0,params:'update'})
}
// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，将来在模板中展示
  SpuParams.value = spu;
  //spu:为父组件传递过来的已有的SPU对象[不完整]
  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark();
  // console.log(result);
  // 获取某一个品牌旗下全部售卖商品图片
  let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
  // 获取已有的SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
  // 获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();


  // 存储全部品牌数据
  AllTradeMark.value = result.data;
  // SPU对应商品图片
  imgList.value = result1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  // 存储已有的SPU销售属性
  saleAttr.value = result2.data;
  // 存储全部的销售属性
  allSaleAttr.value = result3.data;
}

// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  // 对话框弹出
  dialogVisible.value = true
  // 存储预览图片
  dialogImageUrl.value = file.url
}

// 照片墙删除钩子
const handleRemove = () => {

}

// 计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 全部销售属性：颜色/版本/尺码
  // 已有的销售属性：颜色/版本
  let unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName//saleAttrValueName和视频名称不一致
    })
  })
  return unSelectArr
})

// 照片墙上传成功前的钩子,约束文件的大小与类型
const handlerUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4MB'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件类型为PNG|JPG|GIF'
    })
    return false
  }
}

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象：将来带给服务器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 添加属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 切换编辑模式
  row.flag = true
  row.saleAttrValue = ''
}

// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 整理收集的ID与属性值名字
  const { baseSaleAttrId, saleAttrValue } = row;
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string)
  }
  // 非法判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  // 判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  // 切换查看模式
  row.flag = false
}

// 保存按钮回调
const save = async () => {
  // 整理参数
  // 1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  // 2：整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value

  // 发送请求：添加SPU|更新已有的SPU
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  // 成功
  // 失败
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    // 通知父组件切换场景为0
    $emit('changeScene', {flag:0,params:SpuParams.value.id ? 'update' : 'add'})

  } else {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新失败' : '添加失败'
    })
  }
}

// 添加一个新的SPU初始化请求的方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '',//收集三级分类的ID
    spuName: '',//SPU的名字
    description: '',//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: []
  })
  // 清空照片墙
  imgList.value = []
  // 清空已有销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = '';
  // 存储三级分类Id
  SpuParams.value.category3Id = c3Id;
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark();
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
  // 存储数据
  AllTradeMark.value = result.data;
  allSaleAttr.value = result1.data;
}
// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>