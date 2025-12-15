import { md } from '@/libs/markdown';
import { RPChapter } from 'gel-api';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createStreamingMessages, streamingChapters as defaultChapters } from './streamingReport.mock';

type ChapterStatus = 'not_started' | 'pending' | 'receiving' | 'finish';
interface SectionData {
  sectionId: string;
  html: string;
  status: ChapterStatus;
}

export interface StreamingContentUnit {
  chapterId: string;
  content: string;
}

export interface UseStreamingSimulatorOptions {
  speed?: number; // ms per tick
  autoStart?: boolean;
}

export const useStreamingSimulator = (
  outline: RPChapter[] | undefined,
  contents: StreamingContentUnit[] | undefined,
  options?: UseStreamingSimulatorOptions
) => {
  const speed = options?.speed ?? 80;
  const autoStart = options?.autoStart ?? true;

  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(autoStart);
  const timerRef = useRef<number | null>(null);

  // 如果未显式传入 contents，则使用 mock 消息生成逐步内容
  const derivedContents: StreamingContentUnit[] = useMemo(() => {
    if (contents && contents.length > 0) return contents;
    const msgs = createStreamingMessages();
    return msgs.map((m) => ({ chapterId: m.message.chapterId, content: m.message.content }));
  }, [contents]);

  const totalSteps = derivedContents.length;

  useEffect(() => {
    if (!isGenerating) return;
    if (totalSteps === 0) return;
    timerRef.current = window.setInterval(() => {
      setStep((prev) => {
        if (prev + 1 >= totalSteps) {
          window.clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsGenerating(false);
          return totalSteps - 1;
        }
        return prev + 1;
      });
    }, speed);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isGenerating, speed, totalSteps]);

  const restart = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setStep(0);
    setIsGenerating(true);
  };

  // 计算各章节状态与 HTML（按当前 step）
  const sections: SectionData[] = useMemo(() => {
    const effectiveOutline = outline && outline.length > 0 ? outline : defaultChapters;
    if (!effectiveOutline || effectiveOutline.length === 0) return [];
    // 当前激活的章节 code
    const currentCode = derivedContents[step]?.chapterId;
    const finishedSet = new Set(derivedContents.slice(0, step).map((c) => c.chapterId));
    // 仅使用“到当前步为止”的最新文本，确保呈现为逐字符累进而非一次性全文
    const upto = derivedContents.slice(0, step + 1);
    const latestTextByCode = new Map<string, string>();
    upto.forEach((u) => {
      latestTextByCode.set(u.chapterId, u.content);
    });
    const htmlByCode = new Map<string, string>();
    latestTextByCode.forEach((text, code) => {
      htmlByCode.set(code, md.render(text));
    });

    const list: SectionData[] = [];
    const visit = (chapter: RPChapter) => {
      let status: ChapterStatus = 'not_started';
      if (finishedSet.has(String(chapter.chapterId))) status = 'finish';
      else if (String(chapter.chapterId) === currentCode) status = 'receiving';

      const html = status === 'not_started' ? '' : htmlByCode.get(String(chapter.chapterId)) || '';
      list.push({ sectionId: String(chapter.chapterId), html, status });
      chapter.children?.forEach(visit);
    };
    effectiveOutline.forEach(visit);
    return list;
  }, [outline, derivedContents, step]);

  const progress = totalSteps === 0 ? 0 : Math.round(((step + 1) / totalSteps) * 100);

  return { sections, isGenerating, progress, restart };
};
