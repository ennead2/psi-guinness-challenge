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
};

export const HomePage = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [gridColumns, setGridColumns] = useState(2);

  //* 投稿画像リアルタイム取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "thumbnails"),
      async (snapshot) => {
        const _thumbnails = snapshot.docs.map((doc) => doc.data());
        // 数に応じてレイアウトを調整
        const length = _thumbnails.length;
        if (length <= 6) {
          setGridColumns(2);
        } else if (length <= 12) {
          setGridColumns(3);
        } else if (length <= 24) {
          setGridColumns(4);
        } else {
          setGridColumns(5);
        }
        // date型に変換
        _thumbnails.forEach((data) => (data.postedAt = data.postedAt.toDate()));
        // 昇順に並び替え
        _thumbnails.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
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
          <SimpleGrid columns={gridColumns} gap={1}>
            {thumbnails.map((photo) => (
              <Box
                key={photo.thumbnailUrl}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                shadow="sm"
              >
                <Image
                  src={photo.thumbnailUrl}
                  alt=""
                  // objectFit="cover"
                  w="100%"
                  aspectRatio={1 / 1}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </CustomContainer>
    </CustomTransition>
  );
};
