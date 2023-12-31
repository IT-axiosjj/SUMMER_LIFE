// 引入二次封装的axios
import request from '@/utils/request';
import type {CaetgoryResponseData ,AttrResponseData,Attr} from './type';
// 枚举属性管理接口地址
enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性与属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  // 新增或者修改属性的接口地址
  ADDORUPDATE_URL = '/admin/product/saveAttrInfo',
  // 删除某一属性的接口地址
  DELETEATTR_URL = 'admin/product/deleteAttr/'
}

//获取一级分类的接口方法
export const reqC1 = () =>request.get<any,CaetgoryResponseData>(API.C1_URL);
//获取二级分类的接口方法
export const reqC2 = (category1Id:number | string) =>request.get<any,CaetgoryResponseData>(API.C2_URL+category1Id);
//获取三级分类的接口方法
export const reqC3 = (category2Id:number | string) =>request.get<any,CaetgoryResponseData>(API.C3_URL+category2Id);
// 获取对应分类下已有的属性与属性值接口
export const reqAttr = (category1Id:number | string,category2Id:number | string,category3Id:number | string) =>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`);

// 新增或者修改属性的接口方法
export const reqAddOrUpdateAttr = (data:Attr) =>request.post<any,any>(API.ADDORUPDATE_URL,data);
// 删除某一属性的方法
export const reqRemoveAttr = (attrId:number) =>request.delete<any,any>(API.DELETEATTR_URL+attrId);
