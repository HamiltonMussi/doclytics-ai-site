import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/services/query-client";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
