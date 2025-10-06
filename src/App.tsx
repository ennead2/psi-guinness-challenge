import {
  BrowserRouter,
  Route,
  useLocation,
  Routes,
  Navigate,
} from "react-router-dom";
import { Center, VStack, Box, Stack } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./providers/AuthProvider";
import { route } from "./route/route";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { PostLayout } from "./layouts/PostLayout";
import { HomePage } from "./pages/HomePage";
import { SignInPage } from "./pages/SignInPage";
import { SignInCallbackPage } from "./pages/SignInCallbackPage";
import { InputNicknamePage } from "./pages/InputNickname";
import { TakePhotoPage } from "./pages/TakePhotoPage";
import { InformationPage } from "./pages/InformationPage";
import { PostedPhotoList } from "./pages/PostedPhotoList";
import { PhotoConfirmationPage } from "./pages/PhotoConfirmationPage";
import { ChangeNicknamePage } from "./pages/ChangeNickname";
import { TestHomePage } from "./pages/TestHomePage";
import { PSILinkPage } from "./pages/PSILinkPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VStack
          bg={"gray.200"}
          h={"100svh"}
          w={"100svw"}
          gap={0}
          color={"black"}
        >
          {/* <Box h={"10%"} w={"100%"} bg={"green.200"}>
            <Header />
          </Box> */}
          <Box h={"97%"} w={"100%"} bg={"orange.200"}>
            <Body />
          </Box>
          <Box h={"3%"} w={"100%"} bg={"gray.400"}>
            <Footer />
          </Box>
        </VStack>
      </AuthProvider>
    </BrowserRouter>
  );
}

const Body = () => {
  const location = useLocation();
  return (
    <Center h="100%" w="100%" position="relative" overflowX="hidden">
      <AnimatePresence mode="wait">
        //! 新しいページを追加するときはここに追加
        <Routes location={location} key={location.pathname}>
          //* ルートをメインに遷移
          <Route
            path={route.root}
            element={<Navigate to={route.main.root} />}
          />
          //* メイン
          <Route path={route.main.root} element={<MainLayout />}>
            <Route
              path={route.main.root}
              element={<Navigate to={route.main.home} />}
            />
            // ホーム
            <Route path={route.main.home} element={<HomePage />} />
            // 投稿写真一覧
            <Route
              path={route.main.postedPhotoList}
              element={<PostedPhotoList />}
            />
            // ニックネーム変更
            <Route
              path={route.main.changeNickname}
              element={<ChangeNicknamePage />}
            />
            //! for debug ホームページ表示テスト用
            <Route path={"/main/home-test"} element={<TestHomePage />} />
            //! for debug PSIリンクページ
            <Route path={"/main/psi-link"} element={<PSILinkPage />} />
          </Route>
          //* 認証
          <Route path={route.auth.root} element={<AuthLayout />}>
            <Route
              path={route.auth.root}
              element={<Navigate to={route.auth.signIn} />}
            />
            // サインイン
            <Route path={route.auth.signIn} element={<SignInPage />} />
            // サインインコールバック
            <Route
              path={route.auth.signInCallback}
              element={<SignInCallbackPage />}
            />
          </Route>
          //* 写真投稿
          <Route path={route.post.root} element={<PostLayout />}>
            <Route
              path={route.post.root}
              element={<Navigate to={route.post.information} />}
            />
            // 注意事項
            <Route
              path={route.post.information}
              element={<InformationPage />}
            />
            // ニックネーム入力
            <Route
              path={route.post.inputNickname}
              element={<InputNicknamePage />}
            />
            // 写真撮影
            <Route path={route.post.takePhoto} element={<TakePhotoPage />} />
            // 写真確認
            <Route
              path={route.post.photoConfirmation}
              element={<PhotoConfirmationPage />}
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </Center>
  );
};

// const Header = () => {
//   const navigate = useNavigate();

//   return (
//     <Center h="100%" w="100%" bg={"blue.200"}>
//       <Text fontSize="2xl" mr={4}>
//         Link
//       </Text>
//       <Button onClick={() => navigate("/")} m={2}>
//         Home
//       </Button>
//       <Button onClick={() => navigate("/lesson")} m={2}>
//         Lesson
//       </Button>
//       <Button onClick={() => navigate("/setting")} m={2}>
//         Setting
//       </Button>
//     </Center>
//   );
// };

const Footer = () => {
  return (
    <Stack h="100%" w="100%" align={"end"} justify={"end"} py={1} px={3}>
      <small>&copy; 2025 ennead inc.</small>
    </Stack>
  );
};

export default App;
