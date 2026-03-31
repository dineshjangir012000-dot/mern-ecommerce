import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiRequest } from "@/lib/api";

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children,}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await apiRequest("/api/user/logIn", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("response", res);

      localStorage.setItem("token", res.token);
      setUser(res.data);

      return true;
    } catch (error: any) {
      console.error("Login failed:", error.message || error);
      return false;
    }
  }

  async function signup(
    fullName: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const res = await apiRequest("/api/user/signUp", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber: "0000000000",
          age: 20,
        }),
      });

      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
