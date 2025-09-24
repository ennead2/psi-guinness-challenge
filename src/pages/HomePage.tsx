import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text } from "@chakra-ui/react";

export const HomePage = () => {
  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Home</Text>
      </CustomContainer>
    </CustomTransition>
  );
};
