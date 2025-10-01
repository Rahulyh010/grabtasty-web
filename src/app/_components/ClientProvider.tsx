"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BottomNavigation from "./BottomNavigation";
import Footer from "./Footer";
import { Toaster } from "sonner";

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
      <Footer />

      <div className="h-20"></div>
      <BottomNavigation />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
