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
// import { HomePage } from "./pages/HomePage";
// import { LessonPage } from "./pages/LessonPage";
// import { SettingPage } from "./pages/SettingPage";
import { SignInPage } from "./pages/SignInPage";
import { SignInCallbackPage } from "./pages/SignInCallbackPage";
import { HomePage } from "./pages/HomePage";

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
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<Navigate to="/auth/sign-in" />} />
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route
            path="/auth/sign-in/callback"
            element={<SignInCallbackPage />}
          />
          <Route path="/main" element={<HomePage />} />
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
