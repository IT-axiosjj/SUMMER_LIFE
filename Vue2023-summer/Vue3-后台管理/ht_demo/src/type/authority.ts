export interface ListInt {
  namae: string,
  roleId: number,
  roleList?: ListInt[],
  viewRole: string,
}
export class InitData {
  id: number
  authority: number[]
  constructor(id: number, authority: number[]) {
    this.id = id
    this.authority = authority
  }
  list: ListInt[] = []
  treeRef: any
}
