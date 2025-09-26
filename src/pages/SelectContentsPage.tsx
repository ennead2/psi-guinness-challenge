import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";

export const SelectContentsPage = () => {
  const navigate = useNavigate();

  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Select Contents</Text>
        <Stack>
          <Button onClick={() => navigate(route.main.information)}>
            写真を撮影して投稿
          </Button>
          <Button onClick={() => navigate(route.main.photoConfirmation)}>
            投稿画像を確認
          </Button>
        </Stack>
      </CustomContainer>
    </CustomTransition>
  );
};
