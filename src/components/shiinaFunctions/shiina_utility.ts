/**
 * shiina_utility.ts
 *
 * 共通画像処理ユーティリティ
 * - processBase64Image: Base64 → 各サイズ Base64 + metadata
 * - uploadBase64Image: Base64 → relayUpload に送信
 * - fileToBase64: File/Blob → Base64
 */

// recaptchaの初期化が必要
// localhostでは動かないので注意

import { type HttpsCallable } from "firebase/functions";

type RelayUploadResponse = {
  accountId: string;
  base: string;
  base64data: string; //サムネイル用の530×530のBase64
  fileType: string;
  imageId: string;
  name: string;
  ok: boolean;
  version: string;
};

/**
 * uploadBase64Image
 * Base64 を受け取り、各サイズの Base64 を生成して relayUpload に送信
 * @param base64Data data:image/...;base64,... 形式の文字列
 * @param relayUploadFn Firebase Functions の httpsCallable 関数
 * @returns Promise<any> relayUpload のレスポンス
 */
export const uploadBase64Image = async (
  base64Data: string,
  relayUploadFn: HttpsCallable
): Promise<RelayUploadResponse> => {
  const processedImage = await processBase64Image(base64Data);
  const { thumbBase64, displayBase64, rawBase64, fileType, imageName } =
    processedImage;

  const idempotencyKey =
    (typeof crypto !== "undefined" &&
      crypto &&
      typeof crypto.randomUUID === "function" &&
      crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const payload = {
    fileType,
    imageName,
    thumbBase64,
    displayBase64,
    rawBase64,
    idempotencyKey,
  };
  const r = await relayUploadFn(payload);
  return r.data as RelayUploadResponse;
};

/**
 * ProcessedImageResult
 * 各サイズ Base64 とメタデータ
 */
interface ProcessedImageResult {
  fileType: "png" | "jpeg";
  imageName: string;
  displayBase64: string;
  thumbBase64: string;
  rawBase64: string;
  idempotencyKey: string;
}

/**
 * processBase64Image
 * Base64 → 各サイズ Base64 + metadata
 * @param base64 data:image/...;base64,... 形式
 * @param fileName 任意のファイル名
 * @param fileType 任意のファイルタイプ
 */
const processBase64Image = async (
  base64: string,
  fileName: string = "upload.jpg",
  fileType: string = "jpeg"
): Promise<ProcessedImageResult> => {
  const thumbBase64 = await resizeBase64ToBase64(base64, 160, true, 0.9);
  const displayBase64 = await resizeBase64ToBase64(base64, 530, false, 0.9);
  const rawBase64 = await resizeBase64ToBase64(base64, 1000, false, 0.95);

  const idempotencyKey =
    (typeof crypto !== "undefined" &&
      crypto &&
      typeof crypto.randomUUID === "function" &&
      crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    fileType: fileType === "png" ? "png" : "jpeg",
    imageName: fileName,
    thumbBase64,
    displayBase64,
    rawBase64,
    idempotencyKey,
  };
};

/**
 * fileToBase64
 * File/Blob → Base64
 */
export const fileToBase64 = (blobOrFile: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert file to base64"));
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blobOrFile);
  });
};

//----------------- private -----------------

// interface CanvasResult {
//   canvas: HTMLCanvasElement;
// }

const get2d = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D コンテキスト取得失敗");
  return ctx;
};

const base64ToImage = (base64: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = base64;
  });
};

const resizeBase64ToBase64 = async (
  base64: string,
  maxSide: number,
  flg: boolean,
  quality: number = 0.92
): Promise<string> => {
  const img = await base64ToImage(base64);

  let dx = 0,
    dy = 0;
  const r = Math.min(maxSide / img.width, maxSide / img.height, 1);
  const w = Math.round(img.width * r);
  const h = Math.round(img.height * r);

  const cv = document.createElement("canvas");
  if (flg) {
    cv.width = maxSide;
    cv.height = maxSide;
    dx = Math.floor((maxSide - w) / 2);
    dy = Math.floor((maxSide - h) / 2);
  } else {
    cv.width = w;
    cv.height = h;
  }

  const ctx = get2d(cv);
  if (flg) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cv.width, cv.height);
  }

  ctx.drawImage(img, dx, dy, w, h);
  return cv.toDataURL("image/jpeg", quality);
};
