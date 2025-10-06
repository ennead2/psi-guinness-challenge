import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Spacer, Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { useEffect, useRef, useState } from "react";
import { Camera, type CameraHandle } from "@/components/devices/Camera";
import { CustomButton } from "@/components/customs/CustomButton";
import { getOrientation } from "@/components/devices/getOrientation";
import { FlashAnimation } from "@/components/devices/FlashAnimation";

export type TakePhotoPageState = {
  image: string;
  orientation: OrientationType;
};

export const TakePhotoPage = () => {
  const navigate = useNavigate();
  const cameraRef = useRef<CameraHandle>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [orientation, setOrientation] = useState<OrientationType>(
    "landscape-secondary"
  );

  //! 画面回転時にorientationを更新する
  useEffect(() => {
    // 初期化
    setOrientation(getOrientation());

    const handleChange = () => {
      setOrientation(getOrientation());
    };

    // モダンAPI
    if (screen.orientation && "onchange" in screen.orientation) {
      screen.orientation.addEventListener("change", handleChange);
    } else {
      // fallback: iOS Safari など
      window.addEventListener("orientationchange", handleChange);
      window.addEventListener("resize", handleChange); // 念のため
    }

    return () => {
      if (screen.orientation && "onchange" in screen.orientation) {
        screen.orientation.removeEventListener("change", handleChange);
      } else {
        window.removeEventListener("orientationchange", handleChange);
        window.removeEventListener("resize", handleChange);
      }
    };
  }, []);

  //* スクショ撮影して遷移
  const handleCapture = () => {
    setLoading(true);
    setFlash(true);

    if (!cameraRef.current) return;
    const image = cameraRef.current.takeScreenshot(); // base64形式の画像
    // const orientation = getOrientation();
    navigate(route.post.photoConfirmation, { state: { image, orientation } });

    setLoading(false);
  };

  return (
    <CustomTransition>
      <CustomContainer type="post" direction={{ base: "column", sm: "row" }}>
        <Flex
          visibility={{ base: "visible", sm: "hidden" }}
          w={{ base: "100%", sm: "0%" }}
          h={{ base: "100%", sm: "0%" }}
          justify={"center"}
          align={"center"}
        >
          <CustomButton
            type="back"
            onClick={() => navigate(-1)}
            position={"absolute"}
            top={2}
            left={0}
          />
          <Text fontSize={"3xl"} p={4}>
            撮影
          </Text>
        </Flex>

        <Spacer />

        <Box w={{ base: "100%", sm: "50%" }}>
          <Camera ref={cameraRef} />
        </Box>

        <Spacer />

        <CustomButton
          type="photo"
          mb={4}
          onClick={handleCapture}
          loading={loading}
        >
          撮影ボタン
        </CustomButton>

        <FlashAnimation flash={flash} setFlash={setFlash} />
      </CustomContainer>
    </CustomTransition>
  );
};
