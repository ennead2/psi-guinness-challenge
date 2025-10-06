import { Flex, Link, Text } from "@chakra-ui/react";

export const PSILinkPage = () => {
  return (
    <Flex
      h={"100%"}
      w={"100%"}
      bg={"purple.200"}
      justify={"center"}
      align={"center"}
      direction={"column"}
    >
      <Text fontSize="2xl">PSILinkPage</Text>
      <Link href="https://psi-dev.work/sp/636h" color={"blue"}>
        PSI 投稿URL
      </Link>
    </Flex>
  );
};
