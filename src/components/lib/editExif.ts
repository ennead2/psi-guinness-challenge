// import piexif, { type IExif, type IExifElement, TagValues } from "piexif-ts";

// //* exifに回転情報を付与
// export const addExifOrientation = (
//   base64: string,
//   orientation: number
// ): string => {
//   // Exifデータを挿入
//   const zeroth: IExifElement = {};
//   zeroth[TagValues.ImageIFD.Orientation] = orientation; // 1=正位置, 6=90°回転など

//   const exifObj: IExif = { "0th": zeroth };
//   const exifBytes = piexif.dump(exifObj);

//   const newDataUrl = piexif.insert(exifBytes, base64);

//   return newDataUrl;
// };

// //* 画像データのexif情報から回転情報を取得
// export const getExifOrientation = (base64: string): number | null => {
//   if (!piexif) {
//     console.error("piexif is not loaded.");
//     return null;
//   }
//   const exifData = piexif.load(base64);
//   // 画像データとして認識できなかった場合nullを返す
//   if (!exifData["0th"]) return null;

//   const orientation = exifData["0th"][TagValues.ImageIFD.Orientation];
//   return orientation;
// };

import piexif from "piexifjs";
import { type IExifElement } from "piexif-ts";

//* exifに回転情報を付与
export const addExifOrientation = (
  base64: string,
  orientation: number
): string => {
  // Exifデータを挿入
  const zeroth: IExifElement = {};
  zeroth[piexif.ImageIFD.Orientation] = orientation; // 1=正位置, 6=90°回転など

  const exifObj = { "0th": zeroth };
  const exifBytes = piexif.dump(exifObj);

  const newDataUrl = piexif.insert(exifBytes, base64);
  return newDataUrl;
};

//* 画像データのexif情報から回転情報を取得
export const getExifOrientationFromUrl = async (
  url: string
): Promise<number | null> => {
  if (!piexif) {
    console.error("piexif is not loaded.");
    return null;
  }
  // URL から Blob を取得
  const blob = await fetch(url).then((res) => res.blob());

  // Blob → DataURL(base64)
  const dataUrl = await blobToDataURL(blob);

  const exifData = piexif.load(dataUrl);
  // 画像データとして認識できなかった場合nullを返す
  if (!exifData["0th"]) return null;

  const orientation = exifData["0th"][piexif.ImageIFD.Orientation];
  return orientation;
};

// Blob → DataURL(base64)
export const blobToDataURL = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
