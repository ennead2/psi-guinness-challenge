import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase/firebase";

//? firebase auth provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  //* ページ遷移時にログイン状態を確認
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      // ログアウトした場合ログインページに遷移
      if (!authUser && location.pathname.includes("/auth")) {
        navigate("/auth/sign-in", { replace: true });
        return;
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return <>{children}</>;
};
