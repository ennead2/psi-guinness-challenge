import { Outlet, useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { Text, Stack } from "@chakra-ui/react";
import { CustomButton } from "@/components/customs/CustomButton";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";
import { auth, db } from "@/firebase/firebase";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export const MainLayout = () => {
  return (
    <Stack
      w={"100%"}
      h={"100%"}
      bg={"gray.200"}
      align={"start"}
      justify={"start"}
    >
      <header
        style={{
          height: "12%",
          width: "100%",
        }}
      >
        <Header />
      </header>

      <main
        style={{
          height: "88%",
          width: "100%",
        }}
      >
        <Outlet />
      </main>
    </Stack>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const uid = useAtomValue(uidAtom);

  const [nickname, setNickname] = useState<string | null>(null);
  const [isPhotoPosted, setIsPhotoPosted] = useState(false);

  useEffect(() => {
    if (!uid) {
      setNickname("匿名ログイン中");
      // ニックネーム変更ページにいた場合ホームに遷移
      if (window.location.pathname === route.main.changeNickname) {
        navigate(route.main.home);
      }
      return;
    }
    (async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        if ("nickname" in userDoc.data()) {
          setNickname(userDoc.data().nickname);
        } else {
          setNickname("ニックネーム未設定");
        }
        if ("postedAt" in userDoc.data()) {
          setIsPhotoPosted(true);
        }
      } else {
        setNickname("ニックネーム未設定");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <Stack w={"100%"} h={"100%"} px={2} py={1}>
      <Stack
        w={"100%"}
        h={"100%"}
        direction={"row"}
        justify={"space-between"}
        align={"center"}
      >
        <CustomButton type="select" onClick={() => navigate(route.main.home)}>
          ホーム
        </CustomButton>
        <CustomButton
          type="select"
          onClick={() => navigate(route.main.postedPhotoList)}
        >
          投稿写真一覧
        </CustomButton>
        <CustomButton
          type="select"
          onClick={() => navigate(route.post.information)}
          disabled={!uid || isPhotoPosted}
        >
          写真を撮影
        </CustomButton>
      </Stack>

      <Stack
        w={"100%"}
        h={"100%"}
        direction={"row"}
        justify={"space-between"}
        align={"center"}
      >
        <Stack direction={"row"} align={"center"}>
          <Text minW={"150px"}>{nickname}</Text>
          <CustomButton
            type="ok"
            onClick={() => navigate(route.main.changeNickname)}
            disabled={!uid}
            p={0}
            w={"auto"}
          >
            変更
          </CustomButton>
        </Stack>

        {!uid ? (
          <CustomButton
            type="select"
            onClick={() => navigate(route.auth.signIn)}
            disabled={!!uid}
          >
            ログイン
          </CustomButton>
        ) : (
          <CustomButton
            type="cancel"
            py={0}
            w={"auto"}
            onClick={() => auth.signOut()}
            disabled={!uid}
          >
            ログアウト
          </CustomButton>
        )}
      </Stack>
    </Stack>
  );
};
