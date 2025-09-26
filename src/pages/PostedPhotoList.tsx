import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text } from "@chakra-ui/react";

export const PostedPhotoList = () => {
  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Posted Photo List</Text>
      </CustomContainer>
    </CustomTransition>
  );
};
