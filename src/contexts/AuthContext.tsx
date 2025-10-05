import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/router";
import { api } from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const signOut = () => {
    destroyCookie(undefined, "doclytics.token");
    setUser(null);
    router.push("/login");
  };

  const signIn = async (email: string, password: string) => {
    const response = await api.post("/users/login", { email, password });
    const { access_token, user: userData } = response.data;

    setCookie(undefined, "doclytics.token", access_token, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    router.push("/chat");
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await api.post("/users/register", { name, email, password });
    const { access_token, user: userData } = response.data;

    setCookie(undefined, "doclytics.token", access_token, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    router.push("/chat");
  };

  useEffect(() => {
    const { "doclytics.token": token } = parseCookies();

    if (token) {
      api
        .get("/users/me")
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
