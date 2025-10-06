import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Stack, Spacer, Input, Field } from "@chakra-ui/react";
import { CustomButton } from "@/components/customs/CustomButton";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { doc, collection, setDoc, getDocs, getDoc } from "firebase/firestore";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";

export const ChangeNicknamePage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [preNickname, setPreNickname] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<
    "ニックネームを変更" | "ニックネームを変更しない"
  >("ニックネームを変更");
  const [isSending, setIsSending] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
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
      setButtonState("ニックネームを変更");
    }
  }, [nickname, preNickname]);

  //* 入力内容取得
  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDuplicate(false);
    const value = event.target.value.substring(0, 16);
    setNickname(value);
  };

  //* エンターキーで送信
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendNickname();
    }
  };

  //* ニックネームを送信
  const handleSendNickname = async () => {
    setIsSending(true);
    try {
      if (!uid) return;
      // 変更がない場合はそのまま遷移
      if (nickname === preNickname) {
        navigate(route.post.takePhoto);
        return;
      }
      // 重複チェック
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => doc.data());
      const isDuplicate = users.some((user) => user.nickname === nickname);
      if (isDuplicate) {
        setIsDuplicate(true);
        return;
      }
      // ニックネームを保存
      await setDoc(doc(db, "users", uid), { nickname }, { merge: true });
      // 投稿写真一覧ページに遷移
      navigate(route.main.postedPhotoList);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CustomTransition>
      <CustomContainer type="main">
        <Text fontSize={"3xl"} p={4}>
          ニックネーム変更
        </Text>

        <Spacer />

        <Stack w={"100%"} p={4}>
          <Field.Root invalid={isDuplicate}>
            <Input
              type="text"
              placeholder={"ニックネーム"}
              value={nickname}
              p={4}
              bg={"gray.100"}
              onChange={handleNicknameChange}
              onKeyDown={handleKeyDown}
            />
            <Field.ErrorText px={2}>
              既に使用されているニックネームです
            </Field.ErrorText>
          </Field.Root>
        </Stack>

        <Spacer />

        <CustomButton
          type="ok"
          mb={2}
          onClick={handleSendNickname}
          disabled={!nickname || isDuplicate}
          loading={isSending}
        >
          {buttonState}
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
