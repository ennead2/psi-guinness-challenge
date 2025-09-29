import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Stack, Spacer } from "@chakra-ui/react";
import { CustomButton } from "@/components/customs/CustomButton";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";

export const InformationPage = () => {
  const navigate = useNavigate();

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
          注意事項
        </Text>

        <Spacer />

        <Stack bg={"gray.100"} p={4} rounded={"md"} fontWeight={"semibold"}>
          <Text p={2}>写真は一度しかアップロードできません。</Text>
          <Text p={2}>アップロードした画像は変更できません。</Text>
          <Text p={2}>
            このサイト内で撮影した写真のみアップロードできます。
          </Text>
          <Text p={2}>
            画像と合わせてニックネームが表示されます。公序良俗に反するニックネームは使用できません。
          </Text>
        </Stack>

        <Spacer />

        <CustomButton
          type="ok"
          onClick={() => navigate(route.post.inputNickname)}
        >
          ニックネーム入力へ
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
