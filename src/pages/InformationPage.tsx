import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Spacer, List } from "@chakra-ui/react";
import { CustomButton } from "@/components/customs/CustomButton";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";

export const InformationPage = () => {
  const navigate = useNavigate();

  return (
    <CustomTransition>
      <CustomContainer type="post">
        <CustomButton
          type="back"
          onClick={() => navigate(-1)}
          position={"absolute"}
          top={2}
          left={0}
        />
        <Text fontSize={"3xl"} p={4}>
          注意事項
        </Text>

        <Spacer />

        <List.Root
          bg={"gray.100"}
          p={6}
          gap={6}
          rounded={"md"}
          fontWeight={"semibold"}
        >
          <List.Item>写真は一度しかアップロードできません。</List.Item>
          <List.Item>アップロードした画像は変更できません。</List.Item>
          <List.Item>
            このサイト内で撮影した写真のみアップロードできます。
          </List.Item>
          <List.Item>
            画像と合わせてニックネームが表示されます。公序良俗に反するニックネームは使用できません。
          </List.Item>
        </List.Root>

        <Spacer />

        <CustomButton
          type="ok"
          mb={2}
          onClick={() => navigate(route.post.inputNickname)}
        >
          ニックネーム入力へ
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
