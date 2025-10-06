import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Image, Spacer, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { CustomButton } from "@/components/customs/CustomButton";
import { db, storage, functions } from "@/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, uploadString } from "firebase/storage";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { type TakePhotoPageState } from "./TakePhotoPage";
import { uploadBase64Image } from "@/components/shiinaFunctions/shiina_utility";
import { httpsCallable } from "firebase/functions";
import { rotateImage } from "@/components/lib/editImage";

//! psiと連携するか切り替え
const psiMode = false;

export const PhotoConfirmationPage = () => {
  const state = useLocation().state as TakePhotoPageState;
  const navigate = useNavigate();
  const uid = useAtomValue(uidAtom);
  const [isSending, setIsSending] = useState(false);
  const [rotation, setRotation] = useState(0);

  //* 初回は撮影時の向きを反映
  useEffect(() => {
    if (state.orientation === "portrait-primary") setRotation(0);
    else if (state.orientation === "portrait-secondary") setRotation(180);
    else if (state.orientation === "landscape-primary") setRotation(-90);
    else if (state.orientation === "landscape-secondary") setRotation(90);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (psiMode) {
        //* psiに画像を送信
        // firebaseのhttpsCallableを呼び出す
        const uploadImage = httpsCallable(functions, "relayUpload");
        // psiに画像を送信
        const data = await uploadBase64Image(state.image, uploadImage);
        // サムネイル画像をfirestoreに保存
        const imageRefThumbnail = ref(
          storage,
          `users/${uid}/${uid}_thumbnail.jpg`
        );
        const directUrlThumbnail = `https://firebasestorage.googleapis.com/v0/b/${
          import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
        }/o/users%2F${uid}%2F${uid}_thumbnail.jpg?alt=media`;
        await uploadString(imageRefThumbnail, data.base64data, "data_url");
        // firestoreに保存
        await setDoc(
          doc(db, "psi-users", uid),
          {
            thumbnailUrl: directUrlThumbnail,
            postedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        //* firebaseに画像を送信
        // base64からFileオブジェクトに変換
        const imageFile = base64ToFile(state.image, "photo.jpg");
        // 画像を回転
        const rotatedFile = await rotateImage(imageFile, rotation);
        // 画像を圧縮
        const compressedFilePhoto = await compressImage(rotatedFile, 1024);
        const compressedFileThumbnail = await compressImage(rotatedFile, 200);
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
            postedAt: serverTimestamp(),
          },
          { merge: true }
        );
        // サムネイルコレクションにも保存
        await setDoc(
          doc(db, "thumbnails", uid),
          {
            thumbnailUrl: directUrlThumbnail,
            postedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
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
      <CustomContainer type="post">
        <CustomButton
          type="back"
          onClick={() => navigate(-1)}
          position={"absolute"}
          top={2}
          left={0}
        />
        <Text fontSize={"3xl"} p={4}>
          投稿写真確認
        </Text>

        <Spacer />

        <Image src={state.image} transform={`rotate(${rotation}deg)`} />

        <Flex w={"100%"} justify={"end"} px={2} py={1}>
          <CustomButton
            type="rotate"
            disabled={true}
            onClick={async () => {
              const rot = rotation === 270 ? 0 : rotation + 90;
              setRotation(rot);
            }}
          >
            画像回転ボタン
          </CustomButton>
        </Flex>

        {/* <Spacer />

        <Text fontSize={"md"} p={4}>
          写真は一度しか投稿できません。
          <br />
          また、投稿後の変更はできません。
        </Text> */}

        <Spacer />

        <CustomButton mb={2} onClick={handleSendImage} loading={isSending}>
          写真を投稿
        </CustomButton>
      </CustomContainer>
    </CustomTransition>
  );
};
