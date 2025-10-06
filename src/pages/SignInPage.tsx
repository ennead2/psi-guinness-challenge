import { Text, Spacer, Stack, Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import lineLoginBtn from "/line_btn_login_base.png";
import { CustomButton } from "@/components/customs/CustomButton";
import { route } from "@/route/route";
import { useState } from "react";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { ulid } from "ulid";

export const SignInPage = () => {
  // 環境変数
  const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  // const frontend_redirect_uri = "https://localhost:5000";

  const redirect_uri = `${REDIRECT_URI}`;
  // + `?frontend_redirect_uri=${frontend_redirect_uri}`;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //* LINEログインURL
  const lineLoginUrl =
    `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&state=${ulid()}` +
    `&scope=openid%20profile%20email`;

  //* カスタムログイン
  const customLoginUrl = `https://asia-northeast1-psiguinnesschallenge.cloudfunctions.net/customAuthApi/customToken?uid=random:`;
  const handleCustomLogin = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`${customLoginUrl}${ulid()}`, {
        method: "GET",
      });
      if (res.ok) {
        const token = await res.text();
        navigate(`${route.auth.signInCallback}?token=${token}`);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomContainer type="auth">
      <CustomButton
        type="back"
        onClick={() => navigate(-1)}
        position={"absolute"}
        top={6}
        left={4}
      />

      <Stack w={"100%"} justify={"center"} p={4} align={"center"}>
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
          <Link to={loading ? "" : lineLoginUrl}>
            <Image src={lineLoginBtn} />
          </Link>
        </Stack>
      </Stack>

      <Stack w={"100%"} p={4}>
        <Text fontSize={"lg"} fontWeight={"semibold"}>
          ランダムなUIDでログイン
        </Text>
        <CustomButton
          type="ok"
          w={"fit-content"}
          loading={loading}
          onClick={handleCustomLogin}
          fontSize={"md"}
        >
          ログイン
        </CustomButton>
      </Stack>

      <Spacer />

      {isError && (
        <Text>
          ログインに失敗しました。お手数ですが通信状況をお確かめの上再度お試しください。
        </Text>
      )}
    </CustomContainer>
  );
};
