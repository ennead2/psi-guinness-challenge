import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Image, Spacer } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { CustomButton } from "@/components/customs/CustomButton";
import { db, storage } from "@/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import imageCompression from "browser-image-compression";

export const PhotoConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const uid = useAtomValue(uidAtom);
  const [isSending, setIsSending] = useState(false);

  //* base64からFileオブジェクトに変換
  const base64ToFile = (
    base64: string,
    filename: string,
    mimeType?: string
  ) => {
    const dataUrlMatch = base64.match(/^data:([^;]+);base64,(.*)$/);
    let actualBase64: string;
    let actualMime: string | undefined = mimeType;

    if (dataUrlMatch) {
      actualMime = actualMime ?? dataUrlMatch[1];
      actualBase64 = dataUrlMatch[2];
    } else {
      actualBase64 = base64;
    }

    // atob でデコードしてバイト配列を作る
    const binaryString = atob(actualBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes.buffer], {
      type: actualMime ?? "application/octet-stream",
    });
    return new File([blob], filename, { type: actualMime ?? "image/jpeg" });
  };

  //* 画像を圧縮
  const compressImage = async (imageFile: File, maxWidthOrHeight: number) => {
    const options = {
      // maxSizeMB: 0.1,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  };

  //* 画像を送信
  const handleSendImage = async () => {
    setIsSending(true);
    try {
      if (!uid) return;
      // base64からFileオブジェクトに変換
      const imageFile = base64ToFile(state.image, "photo.jpg");
      // 画像を圧縮
      const compressedFilePhoto = await compressImage(imageFile, 1024);
      const compressedFileThumbnail = await compressImage(imageFile, 200);
      // Firebase Storageに保存するパスを指定
      const imageRefPhoto = ref(storage, `users/${uid}/${uid}_photo.jpg`);
      const imageRefThumbnail = ref(
        storage,
        `users/${uid}/${uid}_thumbnail.jpg`
      );
      const directUrlPhoto = `https://firebasestorage.googleapis.com/v0/b/${
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
      }/o/users%2F${uid}%2F${uid}_photo.jpg?alt=media`;
      const directUrlThumbnail = `https://firebasestorage.googleapis.com/v0/b/${
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
      }/o/users%2F${uid}%2F${uid}_thumbnail.jpg?alt=media`;
      // Firebase Storageに画像をアップロード
      await uploadBytes(imageRefPhoto, compressedFilePhoto);
      await uploadBytes(imageRefThumbnail, compressedFileThumbnail);
      // Firestoreに画像のURLを保存
      await setDoc(
        doc(db, "users", uid),
        {
          photoUrl: directUrlPhoto,
          thumbnailUrl: directUrlThumbnail,
          isPhotoSet: true,
          postedAt: serverTimestamp(),
        },
        { merge: true }
      );
      // 投稿写真一覧ページに遷移
      navigate(route.main.postedPhotoList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CustomTransition>
      <CustomContainer>
        <CustomButton
          type="back"
          onClick={() => navigate(-1)}
          position={"absolute"}
          top={6}
          left={4}
        />
        <Text fontSize={"3xl"} p={4}>
          投稿写真確認
        </Text>

        <Spacer />

        <Image src={state.image} />

        <Spacer />

        <Text fontSize={"md"} p={4}>
          写真は一度しか投稿できません。
          <br />
          また、投稿後の変更はできません。
        </Text>

        <Spacer />

        <CustomButton onClick={handleSendImage} loading={isSending}>
          写真を投稿
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
