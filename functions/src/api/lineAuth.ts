import { admin } from "../lib/firebase";
import express from "express";

export const lineAuthApp = express();

lineAuthApp.get("/line/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send("Missing authorization code.");
    return;
  }

  // const {
  //   LINE_CLIENT_ID,
  //   LINE_CLIENT_SECRET,
  //   LINE_REDIRECT_URI,
  //   FRONTEND_REDIRECT_URI,
  // } = process.env;

  const LINE_CLIENT_ID = "2008167320";
  const LINE_CLIENT_SECRET = "3cbe4b52b6a780d673307bcc5f7ff1ca";
  const LINE_REDIRECT_URI =
    "https://asia-northeast1-psiguinnesschallenge.cloudfunctions.net/lineAuthApi/line/callback";
  // const FRONTEND_REDIRECT_URI =
  //   "https://chat-app-with-line.web.app/sign-in/callback";
  const FRONTEND_REDIRECT_URI = "https://localhost:5173/auth/sign-in/callback";

  try {
    // console.log(
    //   `client_id: ${LINE_CLIENT_ID}, client_secret: ${LINE_CLIENT_SECRET}, redirect_uri: ${LINE_REDIRECT_URI}, frontend_redirect_uri: ${FRONTEND_REDIRECT_URI}`
    // );

    // 1. アクセストークン取得
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: LINE_REDIRECT_URI!,
      client_id: LINE_CLIENT_ID!,
      client_secret: LINE_CLIENT_SECRET!,
    });

    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Token request failed: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. プロフィール取得
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileRes.ok) {
      const errText = await profileRes.text();
      throw new Error(`Profile request failed: ${errText}`);
    }

    const profile = await profileRes.json();
    const lineUserId = profile.userId;
    const displayName = profile.displayName;

    // 3. Firebaseカスタムトークン生成
    const uid = `line:${lineUserId}`;
    const customToken = await admin.auth().createCustomToken(uid, {
      name: displayName,
    });

    // 4. フロントにリダイレクト（カスタムトークン付き）
    res.redirect(`${FRONTEND_REDIRECT_URI}?token=${customToken}`);
  } catch (err) {
    console.error("LINE login failed", err);
    res.status(500).send("LINE login failed");
  }
});
