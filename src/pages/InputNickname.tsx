import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Stack, Spacer, Input } from "@chakra-ui/react";
import { CustomButton } from "@/components/customs/CustomButton";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { doc, collection, setDoc, getDocs, getDoc } from "firebase/firestore";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";

export const InputNicknamePage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [preNickname, setPreNickname] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<
    "ニックネームを送信" | "送信中・・・" | "ニックネームを変更しない"
  >("ニックネームを送信");
  const uid = useAtomValue(uidAtom);

  //* 現在入力されているニックネームを取得
  useEffect(() => {
    (async () => {
      if (!uid) return;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        if ("nickname" in userDoc.data()) {
          setPreNickname(userDoc.data().nickname);
          setNickname(userDoc.data().nickname);
        }
      }
    })();
  }, [uid]);

  //* ニックネームの変更を検知
  useEffect(() => {
    if (nickname === preNickname) {
      setButtonState("ニックネームを変更しない");
    } else {
      setButtonState("ニックネームを送信");
    }
  }, [nickname, preNickname]);

  //* 入力内容取得
  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  //* ニックネームを送信
  const handleSendNickname = async () => {
    if (!uid) return;
    // 変更がない場合はそのまま遷移
    if (nickname === preNickname) {
      navigate(route.main.takePhoto);
      return;
    }
    // 重複チェック
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => doc.data());
    const isDuplicate = users.some((user) => user.nickname === nickname);
    if (isDuplicate) {
      alert("既に使用されているニックネームです。");
      return;
    }
    // ニックネームを保存
    await setDoc(
      doc(db, "users", uid),
      { nickname, isNicknameSet: true },
      { merge: true }
    );
    // 撮影ページに遷移
    navigate(route.main.takePhoto);
  };

  return (
    <CustomTransition>
      <CustomContainer>
        <CustomButton
          type="back"
          onClick={() => navigate(-1)}
          position={"absolute"}
          top={6}
          left={4}
        />
        <Text fontSize={"3xl"} p={4}>
          ニックネーム入力
        </Text>

        <Spacer />

        <Stack w={"100%"} p={4}>
          <Input
            type="text"
            placeholder={"ニックネーム"}
            value={nickname}
            p={4}
            bg={"gray.100"}
            onChange={handleNicknameChange}
          />
        </Stack>

        <Spacer />

        <CustomButton
          type="ok"
          onClick={handleSendNickname}
          disabled={!nickname}
        >
          {buttonState}
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
