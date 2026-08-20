'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// we avoid importing React directly so the typechecker doesn’t complain when
// dependencies aren’t installed in this environment.  `JSX.Element` is
// available globally thanks to `jsx: "react-jsx"` in tsconfig.
interface Props extends ThemeProviderProps {
  children: JSX.Element | JSX.Element[]
}

export function ThemeProvider({ children, ...props }: Props) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
