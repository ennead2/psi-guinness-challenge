// import { CustomContainer } from "@/components/customs/CustomContainer";
import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Box, SimpleGrid, Image } from "@chakra-ui/react";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

type Thumbnail = {
  thumbnailUrl: string;
  postedAt: Date;
  rotation: number;
};

export const HomePage = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [gridColumns, setGridColumns] = useState(6);
  const [gridGap, setGridGap] = useState(0.5);
  const [length, setLength] = useState(0);

  //* 投稿画像リアルタイム取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "thumbnails"),
      async (snapshot) => {
        const _thumbnails = snapshot.docs.map((doc) => doc.data());
        // 数に応じてレイアウトを調整
        const _length = _thumbnails.length;
        setLength(_length);
        if (_length <= 60) {
          setGridColumns(6);
          setGridGap(0.5);
        } else if (_length <= 104) {
          setGridColumns(8);
          setGridGap(0.3);
        } else if (_length <= 209) {
          setGridColumns(8);
          setGridGap(0.3);
        } else if (_length <= 308) {
          setGridColumns(14);
          setGridGap(0.2);
        } else if (_length <= 400) {
          setGridColumns(16);
          setGridGap(0.1);
        } else {
          setGridColumns(18);
          setGridGap(0.1);
        }
        // date型に変換
        _thumbnails.forEach((data) => (data.postedAt = data.postedAt.toDate()));
        // 昇順に並び替え
        _thumbnails.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
        // 回転情報を追加
        _thumbnails.forEach((data) => {
          if ("rotation" in data) return;
          data.rotation = 0;
        });
        // ユーザー情報を登録
        setThumbnails(_thumbnails as Thumbnail[]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CustomTransition>
      <CustomContainer type="main" justify={"start"}>
        <Text fontSize={"3xl"} px={2}>
          PSIギネスチャレンジ
        </Text>

        <Box p={2}>
          <SimpleGrid columns={gridColumns} gap={gridGap}>
            {thumbnails.map((photo, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                shadow="sm"
                outline={
                  index === length - 100
                    ? "1px solid red"
                    : index === length - 200
                    ? "1px solid red"
                    : index === length - 300
                    ? "1px solid red"
                    : index === length - 400
                    ? "1px solid red"
                    : index === length - 500
                    ? "1px solid red"
                    : "none"
                }
              >
                <Image
                  src={photo.thumbnailUrl}
                  alt=""
                  // objectFit="cover"
                  w="100%"
                  aspectRatio={1 / 1}
                  transform={`rotate(${photo.rotation}deg)`}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </CustomContainer>
    </CustomTransition>
  );
};
