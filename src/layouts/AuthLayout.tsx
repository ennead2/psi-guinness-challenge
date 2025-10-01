import { Outlet, useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { Stack } from "@chakra-ui/react";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";

export const AuthLayout = () => {
  const navigate = useNavigate();

  const uid = useAtomValue(uidAtom);

  //* ログイン済みの場合はメインページに遷移
  useEffect(() => {
    if (uid) {
      navigate(route.main.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <Stack
      w={"100%"}
      h={"100%"}
      bg={"gray.200"}
      align={"start"}
      justify={"start"}
    >
      {/* <header
        style={{
          height: "12%",
          width: "100%",
        }}
      >
        <Header />
      </header> */}

      <main
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <Outlet />
      </main>
    </Stack>
  );
};
