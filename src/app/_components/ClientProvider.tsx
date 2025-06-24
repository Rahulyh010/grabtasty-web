"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BottomNavigation from "./BottomNavigation";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [queryClient] = useState(() => new QueryClient())
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <BottomNavigation />
    </QueryClientProvider>
  );
}
