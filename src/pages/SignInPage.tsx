import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Spacer, Stack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import lineLoginBtn from "/line_btn_login_base.png";

export const SignInPage = () => {
  // 環境変数
  const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  //* LINEログインURL
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=random_state&scope=openid%20profile%20email`;

  return (
    <CustomContainer>
      <Stack w={"100%"} justify={"start"} p={4}>
        <Text fontSize={"3xl"} color={"gray.700"}>
          Login Page
        </Text>
      </Stack>

      <Spacer />

      <Stack w={"100%"} p={4}>
        <Text fontSize={"lg"} fontWeight={"semibold"}>
          LINE Login
        </Text>
        <Stack p={0} w={"200px"} textAlign={"center"}>
          <Link to={lineLoginUrl}>
            <Image src={lineLoginBtn} />
          </Link>
        </Stack>
      </Stack>

      <Spacer />
    </CustomContainer>
  );
};
