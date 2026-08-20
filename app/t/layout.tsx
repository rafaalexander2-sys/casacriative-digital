import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarefa | Casa Criative',
  robots: { index: false, follow: false },
}

export default function TaskLayout({ children }: { children: React.ReactNode }) {
  return children
}
