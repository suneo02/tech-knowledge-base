export {}; // 确保文件被视为模块

declare module '*.gif' {
  const content: string;
  export default content;
}

declare global {
  interface External {
    ClientFunc?: (params: string, callback: (res: string) => void) => void;
  }

  interface Window {
    global_wsid?: string;
    external: External;
  }
}
