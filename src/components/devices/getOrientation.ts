import { isMobile } from "react-device-detect";

export const getOrientation = (): OrientationType => {
  // pcの場合はportraitを返す
  if (!isMobile) return "portrait-primary";
  // 新しいAPIが利用可能な場合は、screen.orientationを使用
  if (screen.orientation && screen.orientation.type) {
    return screen.orientation.type as OrientationType;
  }
  // 古いAPIを使う必要がある場合はwindow.orientationを使用
  if ("orientation" in window) {
    const o = (window.orientation as number) || 0;
    return o === 0
      ? "portrait-primary"
      : o === 180
      ? "portrait-secondary"
      : o === 90
      ? "landscape-primary"
      : o === -90
      ? "landscape-secondary"
      : "portrait-primary";
  }
  // どちらも利用できない場合は、デフォルトを'portrait-primary'とする
  return "portrait-primary";
};
