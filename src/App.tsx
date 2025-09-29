import {
  BrowserRouter,
  Route,
  useLocation,
  Routes,
  Navigate,
} from "react-router-dom";
import { Center, VStack, Box, Text, Stack } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./providers/AuthProvider";
import { route } from "./route/route";
import { SignInPage } from "./pages/SignInPage";
import { SignInCallbackPage } from "./pages/SignInCallbackPage";
import { InputNicknamePage } from "./pages/InputNickname";
import { TakePhotoPage } from "./pages/TakePhotoPage";
import { InformationPage } from "./pages/InformationPage";
import { PostedPhotoList } from "./pages/PostedPhotoList";
import { SelectContentsPage } from "./pages/SelectContentsPage";
import { PhotoConfirmationPage } from "./pages/PhotoConfirmationPage";
import { ChangeNicknamePage } from "./pages/ChangeNickname";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VStack bg={"gray.200"} h={"100svh"} w={"100svw"} gap={0}>
          {/* <Box h={"10%"} w={"100%"} bg={"green.200"}>
            <Header />
          </Box> */}
          <Box h={"95%"} w={"100%"} bg={"orange.200"}>
            <Body />
          </Box>
          <Box h={"5%"} w={"100%"} bg={"purple.200"}>
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
        <Routes location={location} key={location.pathname}>
          //! 新しいページを追加するときはここに追加
          <Route path="/" element={<Navigate to={route.selectContents} />} />
          <Route path="/auth" element={<Navigate to={route.auth.signIn} />} />
          <Route path={route.auth.signIn} element={<SignInPage />} />
          <Route
            path={route.auth.signInCallback}
            element={<SignInCallbackPage />}
          />
          <Route
            path="/post"
            element={<Navigate to={route.post.information} />}
          />
          <Route path={route.selectContents} element={<SelectContentsPage />} />
          <Route path={route.post.information} element={<InformationPage />} />
          <Route
            path={route.post.inputNickname}
            element={<InputNicknamePage />}
          />
          <Route path={route.post.takePhoto} element={<TakePhotoPage />} />
          <Route
            path={route.post.photoConfirmation}
            element={<PhotoConfirmationPage />}
          />
          <Route
            path="/list"
            element={<Navigate to={route.list.postedPhotoList} />}
          />
          <Route
            path={route.list.postedPhotoList}
            element={<PostedPhotoList />}
          />
          <Route
            path={route.list.changeNickname}
            element={<ChangeNicknamePage />}
          />
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
    <Stack h="100%" w="100%" align={"end"} justify={"end"} p={1}>
      <Text>ennead.inc</Text>
    </Stack>
  );
};

export default App;
