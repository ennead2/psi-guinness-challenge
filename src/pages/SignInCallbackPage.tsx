import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Spacer, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { route } from "@/route/route";

export const SignInCallbackPage = () => {
  const [loginStatus, setLoginStatus] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  //* ラインログインコールバック処理
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      signInWithCustomToken(auth, token)
        .then(() => {
          // console.log("ログイン成功");
          navigate(route.selectContents);
        })
        .catch((error) => {
          console.error("ログイン失敗", error);
          setLoginStatus(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <CustomContainer>
      <Spacer />
      <Text fontSize={"3xl"} color={"gray.700"}>
        {loginStatus ? "ログイン中・・・" : "ラインログインに失敗しました"}
      </Text>
      <Spacer />
      {!loginStatus && (
        <Stack
          bg={"blue.200"}
          rounded={"md"}
          p={4}
          textAlign={"center"}
          w={"fit-content"}
        >
          <Link to={route.auth.signIn}>ログインページに戻る</Link>
        </Stack>
      )}
      <Spacer />
    </CustomContainer>
  );
};
