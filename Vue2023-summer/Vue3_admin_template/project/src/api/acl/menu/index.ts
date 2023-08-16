
import request from '@/utils/request';
import type { PermissionResponseData, MenuParams } from './type';

// 枚举地址
enum API {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 新增菜单
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  // 编辑菜单
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
  // 删除菜单
  DELETEPREMISSION_URL='/admin/acl/permission/remove/',
}


// 获取菜单数据
export const reqAllPermission = () =>
  request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL);

// 添加与修改菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEPERMISSION_URL, data);
  } else {
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}

// 删除菜单
export const reqRemoveMenu = (id:number) =>
request.delete<any,any>(API.DELETEPREMISSION_URL+id);