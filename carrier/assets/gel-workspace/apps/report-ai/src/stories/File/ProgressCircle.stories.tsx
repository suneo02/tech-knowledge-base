import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { ProgressCircle } from '../../components/File/ProgressCircle';

const meta: Meta<typeof ProgressCircle> = {
  title: 'File/ProgressCircle',
  component: ProgressCircle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SVG 进度圆圈组件，用于显示文件上传进度或其他进度指示。',
      },
    },
  },
  argTypes: {
    progress: {
      description: '进度百分比 (0-100)',
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      description: '圆圈大小',
      control: { type: 'number', min: 16, max: 64, step: 4 },
    },
    radius: {
      description: '圆圈半径',
      control: { type: 'number', min: 5, max: 25, step: 1 },
    },
    strokeWidth: {
      description: '进度条宽度',
      control: { type: 'number', min: 1, max: 5, step: 0.5 },
    },
    strokeColor: {
      description: '进度条颜色',
      control: { type: 'color' },
    },
    backgroundColor: {
      description: '背景圆圈颜色',
      control: { type: 'color' },
    },
    animated: {
      description: '是否显示动画过渡',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础用法
export const Default: Story = {
  args: {
    progress: 65,
    size: 24,
    radius: 10,
    strokeWidth: 2,
    strokeColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    animated: true,
  },
};

// 不同进度状态
export const ProgressStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={0} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>0%</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={25} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>25%</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={50} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>50%</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={75} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>75%</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={100} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>100%</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示不同进度状态下的圆圈外观。',
      },
    },
  },
};

// 不同大小
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={60} size={16} radius={6} strokeWidth={1.5} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>小 (16px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={60} size={24} radius={10} strokeWidth={2} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>中 (24px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={60} size={32} radius={14} strokeWidth={2.5} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>大 (32px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={60} size={48} radius={20} strokeWidth={3} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>特大 (48px)</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示不同大小的进度圆圈。',
      },
    },
  },
};

// 不同颜色主题
export const ColorThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={70} strokeColor="#0596b3" backgroundColor="rgba(5, 150, 179, 0.2)" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>主色调</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={70} strokeColor="#179b4a" backgroundColor="rgba(23, 155, 74, 0.2)" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>成功</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={70} strokeColor="#f06f13" backgroundColor="rgba(240, 111, 19, 0.2)" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>警告</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={70} strokeColor="#e22c2f" backgroundColor="rgba(226, 44, 47, 0.2)" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>错误</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示不同颜色主题的进度圆圈。',
      },
    },
  },
};

// 动画演示
export const AnimatedDemo: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ textAlign: 'center' }}>
        <ProgressCircle progress={progress} size={48} radius={20} strokeWidth={3} />
        <div style={{ marginTop: '16px', fontSize: '14px' }}>进度: {progress}%</div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>自动循环演示动画效果</div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '展示进度圆圈的动画效果，自动从 0% 循环到 100%。',
      },
    },
  },
};

// 文件上传场景
export const FileUploadScenario: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#0596b3',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProgressCircle
          progress={45}
          size={24}
          radius={10}
          strokeWidth={2}
          strokeColor="white"
          backgroundColor="rgba(255, 255, 255, 0.3)"
        />
      </div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '500' }}>报告模板.docx</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>上传中... 45%</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示在文件上传场景中的实际使用效果。',
      },
    },
  },
};

/**
 * 真实上传进度动画测试
 * 使用 ProgressAnimationController 模拟真实的上传进度
 */
export const RealUploadAnimation: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const simulateRealUpload = () => {
      setIsUploading(true);

      // 立即设置初始进度为 1%
      setProgress(1);

      // 模拟真实的上传进度动画
      setTimeout(() => {
        const targetProgress = 95; // 模拟动画到 95%
        const duration = 2200; // 2.2 秒
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const timeProgress = Math.min(elapsed / duration, 1);

          // 使用 easeOutQuart 缓动函数
          const easedProgress = 1 - Math.pow(1 - timeProgress, 4);
          const newProgress = 1 + easedProgress * (targetProgress - 1);

          setProgress(newProgress);

          if (timeProgress < 1) {
            requestAnimationFrame(animate);
          } else {
            // 动画完成后，模拟服务器响应，跳转到 100%
            setTimeout(() => {
              setProgress(100);
              setIsUploading(false);
            }, 500);
          }
        };

        animate();
      }, 100);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#2277a2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ProgressCircle
            progress={progress}
            size={32}
            radius={14}
            strokeWidth={3}
            strokeColor="white"
            animated={true}
          />
        </div>
        <div>
          <button onClick={simulateRealUpload} disabled={isUploading} style={{ marginRight: '8px' }}>
            {isUploading ? '上传中...' : '开始真实上传动画'}
          </button>
          <span>进度: {Math.round(progress)}%</span>
        </div>
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', maxWidth: '300px' }}>
          此动画模拟真实的上传进度：立即显示 1%，然后平滑动画到 95%，最后跳转到 100%
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '使用 ProgressAnimationController 模拟真实的上传进度动画，展示修复后的进度显示效果。',
      },
    },
  },
};
