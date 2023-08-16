// SKU模块接口管理
import request from "@/utils/request";
import type { SkuResponseData,SkuInfoData } from "./type";
// 枚举地址
enum API {
  // 获取已有的商品的数据-SKU
  SKU_URL = '/admin/product/list/',
  // 上架
  SALE_URL='/admin/product/onSale/',
  //下架
  ONSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情接口
  SKUINFO_URL ='/admin/product/getSkuInfo/',
  // 删除SKU数据
  DELETESKU_URL ='/admin/product/deleteSku/'
}
//获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`);
  // 商品上架请求
  export const reqSaleSku = (skuId:number)=>
  request.get<any,any>(API.SALE_URL+skuId);
  // 商品下架请求
  export const reqOnSaleSku = (skuId:number)=>
  request.get<any,any>(API.ONSALE_URL+skuId);
  // 商品详情请求
  export const reqSkuInfo = (skuId:number)=>
   request.get<any,SkuInfoData>(API.SKUINFO_URL+skuId);
  //  删除某一个已有商品
  export const redDeleteSku = (skuId:number)=>
  request.delete<any,any>(API.DELETESKU_URL+skuId);
