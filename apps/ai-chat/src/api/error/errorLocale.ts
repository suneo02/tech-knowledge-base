import { SupportedLocale } from 'gel-util/intl'

export const errorLocale: Record<SupportedLocale, Record<string, string>> = {
  'en-US': {
    // Common
    Cancel: 'Cancel',
    All: 'All',
    StopThinking: 'Stop Thinking', // 停止生成
    AskAgain: 'Retry',
    AliceSearch: 'is answering...',
    ErrorDefault: 'Sorry, has just dealt with too many issues and needs a short break. Please try again later.', // 'Thank you for your question!You can try to re-question or change the question in order to get a better answer.',
    ErrorUnknown: 'found the following information for you:',
    ErrorEmptyVector:
      'We are sorry for not finding the latest content related to your question, but I have found the relevant function for you.You can click to view more information and hope these can help you.',
    StreamError:
      'Thank you for your question!You can try to re-question or change the question in order to get a better answer.',
    ErrorFuse: 'Your usage limit for today has been reached. Please try again tomorrow.',
    ErrorAudit:
      'Considering the restrictions of policy and regulations, I am unable to answer your question. Would you like to ask another question?',
    ErrorUser:
      'Sorry, please confirm if your account information is incorrect or contact your Client Manager for further consultation.',
    ErrorAbort: 'has stopped responding. Please feel free to ask again.',
    ErrorTimeout: 'Sorry, has just dealt with too many issues and needs a short break. Please try again later.', // 'There seems to be something wrong, please try again.',
    ErrorDocExpired: 'The file data has expired, please upload it again.',
    ErrorDocchat:
      "I'm so sorry, there seems to be a little problem.You can try to re-question or change the question in order to get a better answer.",
    FNews: 'News',
    FNA: 'Announcements',
    FRPP: 'Research Report Platform',
    FLaw: 'Laws',
    40321: 'Wind University', //  万得大学
    Copy: 'Copy',
    CopyMsg: 'Copied',
    ErrorFunc: 'found the following function for you:',
    AliceEmptyText: 'Based on your question, I found the following data:', // 根据您的问题，我找到了以下数据：
    AliceAnalyzing: 'Analyzing search history...',
    AliceConnecting: 'Connecting the Wind database...',
    AliceWritingAndAnalyzing: 'Generating programs and analyzing data...',
    AliceFileAnalyzing: 'File analyzing...',
    AliceSearchingResources: 'Searching documents from Wind...',
    AliceBuffering: 'is answering...',
    AnswerRefs: 'The answer refers to the following sources',
    Whatwastheissuewiththeresponse:
      'Please provide detailed feedback, such as missing data, optimization suggestions, etc., to facilitate our further verification and improvement.', // 输入详细反馈，例如缺失数据、数据有误、或优化建议等，便于我们进一步核实完善。
    FeedbackSubmissionSuccess: 'Feedback submission success.', // '反馈提交成功'
    FeedbackbackPleaseTryAgain: 'Feedback failed, please try again.',
    Didntunderstandmyquestion: "Didn't understand my question.", // 没有理解我的问题
    Understoodmyquestion: "Understood my question,but it was't accurate.", // 理解了我的问题，但结果不准确
    Thisisharmfulorunsafe: 'This is harmful or unsafe.', // 答案是有害或者不安全的
    FeedbackWarning1: 'Please select or enter feedback content',
    17235: 'No Data', // 暂无数据
    SearchMore: 'Continue',
    RefTagN: 'NEWS',
    RefTagRN: 'NEWS',
    RefTagA: 'NA',
    RefTagR: 'RPP',
    RefTagL: 'LAW',
    RefTagYQ: 'PO',
    RefTag: 'DATA',
    QueryResults: 'Query Results',
    Data: 'DATA',
    QAshareTitle: 'I had a super interesting conversation with 万得企业库, come take a look!',
    PleaseSelectAConversation: 'Please select a conversation',
    Share: 'Share',
    WechatFriend: 'Wechat Friend',
    SharePictures: 'Share Pictures',
    OpentheWindAlice: 'Open the 万得企业库',
    ScanTheQR: 'Scan the QR code and ask a question',
    noDate: 'no date',
    aliceBanner:
      "Hi, I'm 万得企业库, your intelligent financial assistant! I can instantly connect to the Wind database, answer financial questions, interpret complex documents and provide financial analysis. Do you have any questions at the moment? Please tell me, and I'll help you out!",
    shareTitle: '全球企业库，商业智查助手',
    // 文本输入
    Send: 'Send',
    howCanIHelpYou: 'How can help you?', // 有什么可以帮您
    ContinueAskAlice: 'Reply to 万得企业库...',
    AliceAnswering: 'is answering...',
    // 语音输入
    VoiceStart: 'Long press to Talk',
    VoiceStop: 'Release to Stop',
    VoiceTrans: 'Tap stop to finish and recognize your voice input',
    // 对话管理
    Dialogue: 'Recent',
    RecentTitle: 'Recent Chats',
    RecentEmpty: 'No chats yet',
    NewChat: 'New Chat',
    NewChatWait: 'Please wait until the current chat ends!',
    ChatToday: 'Today',
    ChatYesterday: 'Yesterday',
    ChatSeven: 'Last seven days',
    ChatThirty: 'Last thirty days',
    ChatWeek: 'This Week',
    ChatMonth: 'This Month',
    ChatPrevMonth: 'Last Month',
    ChatEarlier: 'Earlier',
    // 文件问答
    FileReme: "Select File from Wind's Choice",
    FileWeChat: 'Select File from WeChat',
    FileNotSupport: 'File type not supported yet',
    FileUploading: 'Uploading...',
    FileUploadFailed: 'Upload failed',
    FileUploadRetry: 'Upload again',
    FileParsing: 'Parsing...',
    FileParseFailed: 'Parsing failed',
    FileParseRetry: 'Parsing again',
    FileParsed: 'Parsed',
    AnalyzingQues: 'Analyzing: ',
    FileAlbum: 'Select Image from Album',
    FileLocal: 'Select File from Phone',
    JoinWaitingList: 'Join Waiting List',
    JoinedWaitingList: 'Joined Waiting List',
    errorFetch: 'Request failed',
    Image: 'Image',
    Document: 'Document',
    AudiosAndVideos: 'Audios & Videos',
    ContinuechattingwithAlice: 'Continue chatting with 万得企业库',
    SessionRemind: 'Content generated by Wind Alice',
    AllFile: 'All',
    13781: 'Data Source',
  },
  'zh-CN': {
    // 通用
    // 通用
    Cancel: '取消',
    All: '全选',
    StopThinking: '停止生成', // 停止生成
    AskAgain: '重新提问',
    AliceSearch: '正在为您生成答案...',
    ErrorDefault: '似乎遇到了点问题，请稍后再试。', // 默认错误码
    ErrorUnknown: '我无法回答此问题，请尝试换个问题。我是您的商业查询智能助手，我将竭尽全力为您提供有效信息。',
    StreamError: '似乎遇到了点问题，请稍后再试或尝试换个问题。', // 流式生成错误
    ErrorFuse: '今日提问已达上限，请明日再来。',
    ErrorAudit:
      '根据有关政策法规要求，我无法回答此问题，请尝试换个问题。我是您的商业查询智能助手，我将竭尽全力为您提供有效信息。', // 政策限制
    ErrorAbort: '已按您要求停止回答。如有需要可随时重新提问。', // 用户主动停止生成
    ErrorTimeout: '似乎出了点问题，请稍后再向我提问。', // 超时

    FNews: '财经资讯',
    FNA: '公司公告',
    FRPP: '研报平台',
    FLaw: '法律法规',
    40321: '万得大学', // Wind University
    Copy: '复制',
    CopyMsg: '已复制',
    ErrorFunc: '为您找到了以下功能：',
    AliceEmptyText: '根据您的问题，我找到了以下数据：', // Based on your questions, I found the following data.
    AliceAnalyzing: '正在分析您的问题...',
    AliceConnecting: '链接万得全球企业库...',
    AliceWritingAndAnalyzing: '正在编写程序，分析数据...',
    AliceFileAnalyzing: '正在分析文件...',
    AliceSearchingResources: '正在搜索万得文档资料...',
    AliceBuffering: '正在生成回答...',
    AnswerRefs: '以上问答参考了如下资料',
    Whatwastheissuewiththeresponse: '输入详细反馈，例如缺失数据、优化建议等，便于我们进一步核实完善',
    FeedbackSubmissionSuccess: '反馈提交成功',
    FeedbackbackPleaseTryAgain: '反馈失败,请重试',
    Didntunderstandmyquestion: '没有理解我的问题', // "Didn't understand my question"
    Understoodmyquestion: '理解了我的问题，但结果不准确', // 'Understood my question，but it was’t accurate',
    Thisisharmfulorunsafe: '答案是有害或者不安全的', // 'This is harmful or unsafe'
    FeedbackWarning1: '请选择或输入反馈内容',
    17235: '暂无数据', // No Data
    SearchMore: '继续思考',
    RefTagN: '资讯',
    RefTagRN: '资讯',
    RefTagA: '公告',
    RefTagR: '研报',
    RefTagL: '法律法规',
    RefTagYQ: '舆情',
    RefTag: '资料',
    QueryResults: '查询结果',
    Data: '数据',
    QAshareTitle: '我和万得企业库有一段超有意思的对话，你也来看看！',
    PleaseSelectAConversation: '请选择对话',
    Share: '分享',
    WechatFriend: '微信好友',
    SharePictures: '分享图片',
    OpentheWindAlice: '打开万得企业库',
    ScanTheQR: '扫描二维码，向万得企业库提问',
    noDate: '暂无数据',
    aliceBanner:
      'Hi，我是万得企业库，你的智能金融助理！\n我能即时连接万得数据库，解答金融难题、解读复杂文件及提供金融分析。\n此刻你有什么问题吗~\n请告诉我，我来帮你！',
    shareTitle: '全球企业库，商业智查助手',
    // 文本输入
    Send: '发送',
    howCanIHelpYou: '有什么可以帮你?',
    ContinueAskAlice: '您可以继续提问',
    AliceAnswering: '正在回答...',
    // 语音输入
    VoiceStart: '按住说话',
    VoiceStop: '松开停止',
    VoiceTrans: '松开即可停止语音输入',
    // 对话管理
    Dialogue: '对话',
    RecentTitle: '历史对话',
    RecentEmpty: '暂无历史对话',
    NewChat: '新建对话',
    NewChatWait: '请等待当前对话结束',
    ChatToday: '今天',
    ChatWeek: '本周',
    ChatMonth: '这个月',
    ChatPrevMonth: '上个月',
    ChatYesterday: '昨天',
    ChatSeven: '前7天',
    ChatThirty: '前30天',
    ChatEarlier: '更早',
    // 文件问答
    FileReme: 'Wind热门',
    FileWeChat: '微信聊天文件',
    FileNotSupport: '暂不支持查看该类型文件',
    FileUploading: '正在上传...',
    FileUploadFailed: '上传失败',
    FileUploadRetry: '重新上传',
    FileParsing: '正在解析...',
    FileParseFailed: '解析失败',
    FileParseRetry: '重新解析',
    FileParsed: '解析完成',
    AnalyzingQues: '正在分析：',
    FileAlbum: '图片拍照',
    FileLocal: '本地文件',
    JoinWaitingList: '加入等待队列',
    JoinedWaitingList: '已加入等待队列',
    errorFetch: '获取失败',
    AllType: '全部',
    Image: '图片',
    Document: '文档',
    AudiosAndVideos: '音视频',
    ContinuechattingwithAlice: '和 继续聊',
    SessionRemind: '内容生成由 Wind Alice 提供',
    AllFile: '全部',
    13781: '数据来源',
  },
}
