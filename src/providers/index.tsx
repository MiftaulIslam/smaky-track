"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#161616",
            border: "1px solid #282828",
            color: "#e5e5e5",
          },
        }}
      />
    </QueryProvider>
  );
}
