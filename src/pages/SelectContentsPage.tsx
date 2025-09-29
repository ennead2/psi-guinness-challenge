import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Stack, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { CustomButton } from "@/components/customs/CustomButton";

export const SelectContentsPage = () => {
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
          コンテンツ選択
        </Text>

        <Spacer />

        <Stack h={"80%"} justify={"space-evenly"}>
          <CustomButton
            type="select"
            onClick={() => navigate(route.post.information)}
          >
            写真を撮影して投稿
          </CustomButton>
          <CustomButton
            type="select"
            onClick={() => navigate(route.list.postedPhotoList)}
          >
            投稿画像を確認
          </CustomButton>
        </Stack>
      </CustomContainer>
    </CustomTransition>
  );
};
