import { rpOutlineMock1 } from '@/mocks/reportOutline/res1';
import type { Meta, StoryObj } from '@storybook/react';
import { OutlineTreeEditor } from '../../components';
import { failureScenarios, outlineEditorHandlers } from '../../mocks/reportOutline/outlineEditor.msw';

const meta: Meta<typeof OutlineTreeEditor> = {
  title: 'Report/OutlineTreeEditor',
  component: OutlineTreeEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# OutlineTreeEditor 大纲编辑器

这是报告大纲编辑器组件，支持以下功能：

## 核心功能
- ✅ 章节重命名 (重命名操作)
- ✅ 编写思路更新 (更新编写思路)
- ✅ 章节插入 (在指定位置后插入新章节)
- ✅ 章节删除 (删除指定章节)
- ✅ 章节缩进 (增加章节层级)
- ✅ 章节取消缩进 (减少章节层级)

## 乐观更新机制
- 用户操作立即更新UI
- 后台异步同步到服务器
- 同步失败时自动回滚UI状态

## MSW Mock 支持
本组件已配置完整的 MSW Mock 接口，支持：

### 📡 Mock 接口列表
- \`reportChapter/addChapter\` - 新增章节
- \`reportChapter/updateChapter\` - 更新章节 (重命名/编写思路)
- \`reportChapter/deleteChapter\` - 删除章节
- \`reportChapter/indentChapter\` - 缩进章节
- \`reportChapter/outdentChapter\` - 取消缩进章节

### 🎛️ 失败模拟场景
- **None**: 无失败，所有操作成功
- **Low**: 5% 随机失败率
- **Medium**: 15% 随机失败率  
- **High**: 30% 随机失败率
- **Timed**: 定时失败 (每8-15秒失败一次)
- **Mixed**: 混合模式 (随机 + 定时失败)

### 🔧 测试建议
1. 尝试各种编辑操作，观察乐观更新效果
2. 在失败场景下测试错误处理和回滚机制
3. 观察控制台日志了解Mock接口调用情况
4. 测试并发操作的处理能力

### 📊 Mock 数据说明
- 自动生成唯一的章节ID
- 模拟真实的网络延迟 (100-500ms)
- 提供详细的请求/响应日志
- 支持动态配置失败率和失败类型
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OutlineTreeEditor>;

export const Basic: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
  },
  play: async () => {
    failureScenarios.none();
  },
};

export const Readonly: Story = {
  args: {
    initialValue: rpOutlineMock1,
    readonly: true,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
  },
};

export const WithAutoSave: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
  },
  play: async () => {
    failureScenarios.low();
  },
};

export const WithLongWritingThought: Story = {
  args: {
    initialValue: {
      ...rpOutlineMock1,
      chapters:
        rpOutlineMock1.chapters?.map((chapter, index) => {
          if (index === 1 && chapter.children) {
            return {
              ...chapter,
              children: chapter.children.map((child, childIndex) => {
                if (childIndex === 1 && child.children) {
                  return {
                    ...child,
                    children: child.children.map((grandChild, grandChildIndex) => {
                      if (grandChildIndex === 0) {
                        return {
                          ...grandChild,
                          writingThought:
                            '这是一个非常长的编写思路文本，用于测试 writingThought 区域的宽度是否能够自动撑开，以便完整显示较长的内容。这段文字应该能够自动换行并且不会被截断。我们需要确保这个区域能够自适应内容的宽度，特别是当内容很长的时候，应该能够正确地展示所有文字内容，而不会出现布局问题。',
                        };
                      }
                      return grandChild;
                    }),
                  };
                }
                return child;
              }),
            };
          }
          return chapter;
        }) || [],
    },
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
  },
};

// ========== MSW Mock 失败场景测试 ==========

/**
 * 低失败率场景 - 5% 随机失败
 */
export const LowFailureRate: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
    docs: {
      description: {
        story: `**低失败率测试场景**

模拟真实网络环境下的偶发错误，失败率为 5%。

**测试重点**：
- 乐观更新机制
- 错误处理和用户提示
- 自动重试机制
- UI状态回滚

**操作建议**：
1. 多次尝试重命名、插入、删除操作
2. 观察失败时的错误提示
3. 检查UI状态是否正确回滚
4. 查看控制台日志了解失败详情`,
      },
    },
  },
  play: async () => {
    failureScenarios.low();
  },
};

/**
 * 中等失败率场景 - 15% 随机失败
 */
export const MediumFailureRate: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
    docs: {
      description: {
        story: `**中等失败率测试场景**

模拟网络不稳定环境，失败率为 15%。

**测试重点**：
- 频繁失败下的用户体验
- 错误提示的友好性
- 操作流程的健壮性
- 数据一致性保证

**操作建议**：
1. 快速连续执行多个操作
2. 测试不同类型操作的失败处理
3. 验证失败后的数据状态
4. 观察用户界面反馈`,
      },
    },
  },
  play: async () => {
    failureScenarios.medium();
  },
};

/**
 * 高失败率场景 - 30% 随机失败
 */
export const HighFailureRate: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
    docs: {
      description: {
        story: `**高失败率测试场景**

模拟极端网络环境，失败率为 30%。

**测试重点**：
- 极端情况下的系统稳定性
- 用户操作的容错能力
- 错误恢复机制
- 界面状态管理

**操作建议**：
1. 测试系统在高失败率下的表现
2. 验证错误提示是否清晰
3. 检查是否有数据丢失
4. 评估用户体验是否可接受`,
      },
    },
  },
  play: async () => {
    failureScenarios.high();
  },
};

/**
 * 定时失败场景 - 每8-15秒失败一次
 */
export const TimedFailures: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
    docs: {
      description: {
        story: `**定时失败测试场景**

模拟定时网络中断，每个接口按不同间隔定时失败：
- addChapter: 每10秒失败一次
- updateChapter: 每12秒失败一次
- deleteChapter: 每15秒失败一次
- indentChapter: 每8秒失败一次
- outdentChapter: 每11秒失败一次

**测试重点**：
- 可预测失败的处理
- 定时失败模式的识别
- 用户操作时机的影响
- 系统恢复能力

**操作建议**：
1. 等待定时失败触发，观察系统反应
2. 在不同时间点执行操作
3. 测试失败后的立即重试
4. 验证定时模式的准确性`,
      },
    },
  },
  play: async () => {
    failureScenarios.timed();
  },
};

/**
 * 混合失败场景 - 随机 + 定时失败
 */
export const MixedFailures: Story = {
  args: {
    initialValue: rpOutlineMock1,
  },
  parameters: {
    msw: {
      handlers: outlineEditorHandlers,
    },
    docs: {
      description: {
        story: `**混合失败测试场景**

结合随机失败(10%)和定时失败(18-30秒间隔)，模拟最复杂的网络环境。

**测试重点**：
- 复杂失败模式的处理
- 系统在多重压力下的表现
- 用户体验的一致性
- 错误处理的全面性

**操作建议**：
1. 长时间连续操作，观察各种失败模式
2. 测试系统在复杂环境下的稳定性
3. 验证所有错误处理路径
4. 评估整体用户体验质量

**注意事项**：
⚠️ 这是最严苛的测试场景，用于验证系统的极限容错能力`,
      },
    },
  },
  play: async () => {
    failureScenarios.mixed();
  },
};
