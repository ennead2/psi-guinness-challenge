import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Spacer, Stack, Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import lineLoginBtn from "/line_btn_login_base.png";
import { CustomButton } from "@/components/customs/CustomButton";
import { route } from "@/route/route";
import { useEffect } from "react";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";

export const SignInPage = () => {
  // 環境変数
  const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  const navigate = useNavigate();

  const uid = useAtomValue(uidAtom);

  //* LINEログインURL
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=random_state&scope=openid%20profile%20email`;

  //* カスタムログイン
  const customLoginUrl = `https://asia-northeast1-psiguinnesschallenge.cloudfunctions.net/customAuthApi/customToken?uid=random:`;
  const handleCustomLogin = async () => {
    const res = await fetch(`${customLoginUrl}${crypto.randomUUID()}`, {
      method: "GET",
    });
    if (res.ok) {
      const token = await res.text();
      navigate(`${route.auth.signInCallback}?token=${token}`);
    }
  };

  //* ログイン済みの場合はコンテンツ選択へ遷移
  useEffect(() => {
    if (uid) {
      navigate(route.selectContents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

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

      <Stack w={"100%"} p={4}>
        <CustomButton type="ok" w={"fit-content"} onClick={handleCustomLogin}>
          ランダムなUIDでログイン
        </CustomButton>
      </Stack>

      <Spacer />

      <Stack w={"100%"} p={4}>
        <CustomButton
          type="select"
          onClick={() => {
            navigate(route.list.postedPhotoList);
          }}
        >
          ログインせずに投稿一覧を見る
        </CustomButton>
      </Stack>
    </CustomContainer>
  );
};
