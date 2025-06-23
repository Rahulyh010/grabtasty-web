'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // const [queryClient] = useState(() => new QueryClient())
  const queryClient = new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}