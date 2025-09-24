import {
  BrowserRouter,
  Route,
  useLocation,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Center, VStack, Box, Button, Text } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { HomePage } from "./pages/HomePage";
// import { LessonPage } from "./pages/LessonPage";
// import { SettingPage } from "./pages/SettingPage";

function App() {
  return (
    <BrowserRouter>
      <VStack bg={"gray.200"} h={"100svh"} w={"100svw"} gap={0}>
        <Box h={"10%"} w={"100%"} bg={"green.200"}>
          <Header />
        </Box>
        <Box h={"80%"} w={"100%"} bg={"orange.200"}>
          <Body />
        </Box>
        <Box h={"10%"} w={"100%"} bg={"purple.200"}>
          <Footer />
        </Box>
      </VStack>
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
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/lesson" element={<LessonPage />} />
          <Route path="/setting" element={<SettingPage />} /> */}
        </Routes>
      </AnimatePresence>
    </Center>
  );
};

const Header = () => {
  const navigate = useNavigate();

  return (
    <Center h="100%" w="100%" bg={"blue.200"}>
      <Text fontSize="2xl" mr={4}>
        Link
      </Text>
      <Button onClick={() => navigate("/")} m={2}>
        Home
      </Button>
      <Button onClick={() => navigate("/lesson")} m={2}>
        Lesson
      </Button>
      <Button onClick={() => navigate("/setting")} m={2}>
        Setting
      </Button>
    </Center>
  );
};

const Footer = () => {
  return (
    <Center h="100%" w="100%">
      <h1>Footer</h1>
    </Center>
  );
};

export default App;
