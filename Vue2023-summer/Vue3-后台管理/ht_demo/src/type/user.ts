export interface ListInt{
  id:number,
  nickName:string,
  role:RoleInt[],
  userName:string,
}
interface RoleInt{
  role:number,
  roleName:string,
}
interface SelectDataInt{
  role:number,
  nickName:string,
}
interface RoleListInt{
  authority:number[],
  roleId:number,
  roleName:string,
}
interface ActiveInt{
  id:number,
  nickName:string,
  role:number[],
  userName:string,
}
export class InitData{
  selectData:SelectDataInt={
    nickName:'',
    role:0
  }
  list:ListInt[] = []//用来接收用户信息的列表
  roleList:RoleListInt[] = []
  isShow=false
  // 选中的对象
  active:ActiveInt={
    id:0,
    nickName:'',
    role:[],
    userName:'',
  }
}