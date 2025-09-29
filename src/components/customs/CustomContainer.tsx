import { Box, Flex } from "@chakra-ui/react";

export const CustomContainer = (args: { children: React.ReactNode }) => {
  const { children } = args;
  return (
    <Box h={"100%"} w={"100%"} p={4}>
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        w={"100%"}
        h={"100%"}
        bg={"teal.200"}
        p={4}
        color={"black"}
      >
        {children}
      </Flex>
    </Box>
  );
};
