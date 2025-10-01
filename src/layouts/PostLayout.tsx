import { Outlet, useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { Stack } from "@chakra-ui/react";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const PostLayout = () => {
  const navigate = useNavigate();

  const uid = useAtomValue(uidAtom);

  //* 未ログインの場合または既に写真投稿済みの場合はメインページに遷移
  useEffect(() => {
    (async () => {
      if (!uid) {
        navigate(route.main.root);
      } else {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          if ("postedAt" in userDoc.data()) {
            navigate(route.main.root);
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <Stack
      w={"100%"}
      h={"100%"}
      bg={"gray.200"}
      align={"start"}
      justify={"start"}
    >
      {/* <header
        style={{
          height: "12%",
          width: "100%",
        }}
      >
        <Header />
      </header> */}

      <main
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <Outlet />
      </main>
    </Stack>
  );
};
