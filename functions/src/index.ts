import { onRequest } from "firebase-functions/v2/https";
import { lineAuthApp } from "./api/lineAuth";
import { customAuthApp } from "./api/customAuth";

// Firebase Functions のリージョンを指定
import { setGlobalOptions } from "firebase-functions/v2";
setGlobalOptions({
  region: "asia-northeast1",
});

// Firebase Function に Express アプリを登録
export const lineAuthApi = onRequest(lineAuthApp);
export const customAuthApi = onRequest(customAuthApp);
