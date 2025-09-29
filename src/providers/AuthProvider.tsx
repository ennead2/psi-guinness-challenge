import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "@/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { uidAtom } from "@/state/atom";
import { useSetAtom } from "jotai/react";

//? firebase auth provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const setUid = useSetAtom(uidAtom);

  //* ページ遷移時にログイン状態を確認
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // uidをローカルストレージに保存
        const uid = authUser.uid.slice(authUser.uid.indexOf(":") + 1);
        setUid(uid);
        // firestoreにユーザー情報を保存（初回のみ）
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) {
          const userRef = doc(db, "users", uid);
          await setDoc(
            userRef,
            { uid, isNicknameSet: false, isPhotoSet: false },
            { merge: true }
          );
        }
      } else {
        // uidをローカルストレージから削除
        setUid(null);
        // ログアウトした場合、写真投稿中の場合ログインページに遷移
        if (location.pathname.includes("/post/")) {
          navigate("/auth/sign-in", { replace: true });
          return;
        }
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return <>{children}</>;
};
