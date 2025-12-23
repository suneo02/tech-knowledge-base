declare module '*.xlsx' {
  const content: string
  export default content
}

declare module '*.less' {
  const classes: { [key: string]: string }
  export default classes
}
