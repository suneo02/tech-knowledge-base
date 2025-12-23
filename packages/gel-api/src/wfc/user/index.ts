export interface UserOrder {
  // 是否已申请发票
  applyInvoice: boolean
  date: string
  goodsId: string
  orderId: string
  priceYuan: number
  status: {
    code: number
    desc: string
  }
  type: {
    desc: string
  }
}
