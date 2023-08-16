

export interface ResponseDaata{
  code:number,
  message:string,
  ok:boolean,
}
//已有的品牌的ts数据类型
export interface Trademark{
  id?:number,
  tmName:string,
  logoUrl:string,
}

//包含全部品牌数据的ts类型
export type Records = Trademark[];

// 获取已有全部品牌的数据ts的类型
export interface TrademarkResponseData extends ResponseDaata{
  data:{
    records:Records,
    total:number,
    size:number,
    current:number,
    searchCount:boolean,
    pages:number,

  }
}