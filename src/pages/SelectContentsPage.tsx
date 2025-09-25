import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text } from "@chakra-ui/react";

export const SelectContentsPage = () => {
  return (
    <CustomTransition>
      <CustomContainer>
        <Text>Select Contents</Text>
      </CustomContainer>
    </CustomTransition>
  );
};
