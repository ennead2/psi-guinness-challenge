import { onRequest } from "firebase-functions/v2/https";
import { lineAuthApp } from "./api/lineAuth";

// Firebase Functions のリージョンを指定
import { setGlobalOptions } from "firebase-functions/v2";
setGlobalOptions({
  region: "asia-northeast1",
});

// Firebase Function に Express アプリを登録
export const lineAuthApi = onRequest(lineAuthApp);
