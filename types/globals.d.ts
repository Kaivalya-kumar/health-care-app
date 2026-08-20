// stub declarations to make TypeScript happy when node_modules are not installed

// React basics and JSX namespace
declare namespace JSX {
  // we only need minimal types for JSX to parse
  type Element = any
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare module 'react' {
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void]
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void
  export function useRef<T>(initialValue: T): { current: T }
  export const React: any
  const _default: any
  export default _default
}

declare module 'react/jsx-runtime' {
  const jsx: any
  export default jsx
}

// next-themes stubs
declare module 'next-themes' {
  import { ComponentType, PropsWithChildren } from 'react'
  export type ThemeProviderProps = PropsWithChildren<{}> & Record<string, any>
  export const ThemeProvider: ComponentType<ThemeProviderProps>
  export function useTheme(): any
  export default {
    ThemeProvider,
    useTheme,
  }
}
