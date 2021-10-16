declare module '*.png' {
  const url: string
  export default url
}

declare module '*.lazy.css' {
  export const use: () => void
  export const unuse: () => void
}
