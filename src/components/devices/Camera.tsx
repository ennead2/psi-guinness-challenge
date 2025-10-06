// カメラコンポーネント
//
// 1. 必要ライブラリ
//  npm i react-device-detect
//
// 2. 使い方例
//  インポート
//    import { useRef } from "react";
//    import { camera, type CameraHandle } from ...
//  Cameraコンポーネントを参照するためのref
//    const cameraRef = useRef<CameraHandle>(null);
//  スクショ撮影例
//    const handleCapture = () => {
//      if (!cameraRef.current) return;
//      const image = cameraRef.current.takeScreenshot(); // base64形式の画像
//      ...
//    }
//  配置例
//    <Camera ref={cameraRef} />

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
// import { isMobile } from "react-device-detect";

export type CameraHandle = {
  takeScreenshot: () => string | null;
};

export const Camera = forwardRef<CameraHandle>((_, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            // 解像度の目安
            // width: { ideal: isMobile ? 1080 : 1920 },
            // height: { ideal: isMobile ? 1920 : 1080 },
            width: { ideal: 9999 },
            height: { ideal: 9999 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // abort error 回避のため onloadeddataイベントでplay
          // videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      const tracks = // eslint-disable-next-line react-hooks/exhaustive-deps
        (videoRef.current?.srcObject as MediaStream | null)?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      if (!videoRef.current || !canvasRef.current) return null;

      const video = videoRef.current;

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    },
  }));

  // 動画が読み込まれた後にplay
  const handleLoadedData = () => {
    if (videoRef.current) videoRef.current.play();
  };

  return (
    <div
    // style={{
    //   width: "100%", // 横幅いっぱい
    //   maxWidth: "480px", // スマホを意識して制限
    //   // aspectRatio: isMobile ? "9 / 16" : "16 / 9", // 縦長の枠
    //   aspectRatio: "9 / 16", // 縦長の枠
    //   backgroundColor: "black", // 黒で覆うとカメラっぽい
    //   position: "relative",
    // }}
    >
      <video
        ref={videoRef}
        onLoadedData={handleLoadedData}
        playsInline
        muted
        // style={{
        //   width: "100%",
        //   height: "100%",
        //   objectFit: "cover", // 枠にフィット
        //   // transform: "scaleX(-1)", // 必要なら自撮り用に左右反転
        // }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
});
