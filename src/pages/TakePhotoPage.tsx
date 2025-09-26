import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text } from "@chakra-ui/react";

export const TakePhotoPage = () => {
  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Take Photo</Text>
      </CustomContainer>
    </CustomTransition>
  );
};
