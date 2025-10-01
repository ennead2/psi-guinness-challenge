import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { useRef } from "react";
import { Camera, type CameraHandle } from "@/components/devices/Camera";
import { CustomButton } from "@/components/customs/CustomButton";

export const TakePhotoPage = () => {
  const navigate = useNavigate();
  const cameraRef = useRef<CameraHandle>(null);

  //* スクショ撮影して遷移
  const handleCapture = () => {
    if (!cameraRef.current) return;
    const image = cameraRef.current.takeScreenshot(); // base64形式の画像
    navigate(route.post.photoConfirmation, { state: { image } });
  };

  return (
    <CustomTransition>
      <CustomContainer type="post">
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

        <Spacer />

        <Camera ref={cameraRef} />

        <Spacer />

        <CustomButton type="photo" mb={4} onClick={handleCapture}>
          撮影ボタン
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
