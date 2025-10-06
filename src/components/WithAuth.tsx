import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

type WithAuthProps = {
  children: ReactNode;
};

export const WithAuth = ({ children }: WithAuthProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecionando...</p>
      </div>
    );
  }

  return <>{children}</>;
};
