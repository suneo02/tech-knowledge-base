export enum ProgressStatusEnum {
  PENDING = 1, // 待执行
  RUNNING = 2, // 执行中
  SUCCESS = 3, // 完成
  FAILED = 4, // 失败
}

export enum SourceTypeEnum {
  CDE = 1,
  AI_GENERATE_COLUMN = 2,
  INDICATOR = 3,
  UPLOAD_FILE = 4,
  AI_CHAT = 5,
  USER = 6, // 默认为6
  UPLOAD_FILE_ENTITY = 7, // 上传文件已匹配实体 不允许编辑
}

export enum AiModelEnum {
  ALICE = 1,
  DEEPSEEK_V3 = 2,
}

export enum AiToolEnum {
  PC = 1,
  BROWSER = 2,
  DPU = 3,
}
