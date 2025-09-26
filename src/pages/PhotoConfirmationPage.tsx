import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text } from "@chakra-ui/react";

export const PhotoConfirmationPage = () => {
  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Photo Confirmation</Text>
      </CustomContainer>
    </CustomTransition>
  );
};
