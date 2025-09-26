import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text } from "@chakra-ui/react";

export const SendingPage = () => {
  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Sending</Text>
      </CustomContainer>
    </CustomTransition>
  );
};
