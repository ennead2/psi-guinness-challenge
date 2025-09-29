import { admin } from "../lib/firebase";
import express from "express";
import cors from "cors";

export const customAuthApp = express();

// CORSを有効化（必要に応じてドメイン制限）
customAuthApp.use(cors({ origin: true }));

// require uid
customAuthApp.get("/customToken", async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  // uid を取得
  const uid = req.query.uid as string;
  if (!uid) {
    res.status(400).send("Missing uid.");
    return;
  }

  try {
    // console.log(
    //   `client_id: ${LINE_CLIENT_ID}, client_secret: ${LINE_CLIENT_SECRET}, redirect_uri: ${LINE_REDIRECT_URI}, frontend_redirect_uri: ${FRONTEND_REDIRECT_URI}`
    // );

    // Firebaseカスタムトークン生成
    const customToken = await admin.auth().createCustomToken(uid, {
      name: "Custom User",
    });

    // トークンを返却
    res.status(200).send(customToken);
  } catch (err) {
    console.error("LINE login failed", err);
    res.status(500).send("LINE login failed");
  }
});
