// 用户协议来源类型，如果从app或者windzx进入，可以通过添加参数source=app或者source=windzx来区分，可以直接显示单独路由
export enum SourceTypeEnum {
  APP = 'app', // 万得企业库APP
  WINDZX = 'windzx', // 征信官网
  GEL = 'gel', // 万得企业库PC
}
