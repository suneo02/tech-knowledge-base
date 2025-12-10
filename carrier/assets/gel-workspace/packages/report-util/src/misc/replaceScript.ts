export const replaceScript = (str: string) => {
  if (str) {
    str = str.replace(/\<script>/gi, '')
    str = str.replace(/\<\/script>/gi, '')
    str = str.replace(/\<a>/gi, '')
    str = str.replace(/\<\/a>/gi, '')
    str = str.replace(/\<iframe>/gi, '')
    str = str.replace(/\<\/iframe>/gi, '')
    str = str.replace(/\<form>/gi, '')
    str = str.replace(/\<\/form>/gi, '')
    str = str.replace(/\<object>/gi, '')
    str = str.replace(/\<\/object>/gi, '')
    str = str.replace(/\<embed>/gi, '')
    str = str.replace(/\<\/embed>/gi, '')
    str = str.replace(/onclick|onerror|onfocus|onload|onmouse|onkey|ontoggle|javascript|eva|document/gi, '') // 部分xss事件绕过  eva
  }
  return str
}
