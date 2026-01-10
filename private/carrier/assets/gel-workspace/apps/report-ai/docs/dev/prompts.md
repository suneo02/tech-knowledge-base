# prompts

tinymce html 噪音去除

---

保存文档接入 tinymce 的 api autosave save 等

---

跳过新增空章节

---

叶子章节 方法抽象

---

流式 error 状态处理

---

hydration 状态被用在 生成当中了

---

生成编写思路 abort 检查，取消接口发送，这部分逻辑似乎有点问题，没有用 已有的 abort controller 取消接口，并且取消后似乎还有可能继续后续流程

apps/report-ai/src/components/outline/OutlineTreeEditor/hooks/useThoughtGeneration.ts

记录一份 issue ，严格参考规范

---

text preview 跟随

text preview 拓宽

---

aigc loading 在最后一个章节无法看到

---

apps/report-ai/src/types/chat/RPOutline.ts RPOutlineInputContext 需要优化

---

大纲为空时还保留

---

后续需求：前端需要编辑，如何传回给后端？
目前是会将 html 拆分为章节，以结构化配合章节内部的 html 字符串存储，是否直接改为 html 整体一个 字符串存储所有 章节内容就可以了？
由后端来拼接 html，注意需要拼接好章节 id，需要约定好 id 的自定义标记的格式
前端根据 完整的 html 来反向解析出结构化数据，用来展示大纲，根据 id 进行操作等
至于章节的一些 额外结构化数据，是否后端提供一个 章节 id 对应的 map，前端根据map来查询？
目前的树结构数据传输存在问题时，前端进行了 html 的拼接，导致 章节外部的样式无法进行自定义，无法根据用户的自定义样式来进行渲染，后端的样式数据无法利用
