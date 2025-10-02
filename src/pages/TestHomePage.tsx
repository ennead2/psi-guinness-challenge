// import { CustomContainer } from "@/components/customs/CustomContainer";
import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Text, Box, SimpleGrid, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import thumbnail_example from "/public/thumbnail_example.jpg";

type ThumbnailTest = {
  thumbnailUrl: string;
};

export const TestHomePage = () => {
  const [thumbnails] = useState<ThumbnailTest[]>(
    new Array(500).fill({
      thumbnailUrl: thumbnail_example,
    })
  );
  const [length, setLength] = useState(0);
  const [gridColumns, setGridColumns] = useState(6);
  const [gridGap, setGridGap] = useState(0.5);

  //* 投稿画像リアルタイム取得
  useEffect(() => {
    // 数に応じてレイアウトを調整
    const _length = thumbnails.length;
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
  }, [thumbnails]);

  return (
    <CustomTransition>
      <CustomContainer type="main" justify={"start"}>
        <Text fontSize={"2xl"} px={2} color={"red.500"}>
          ホームページ 表示テスト
        </Text>

        <Box px={1}>
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
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </CustomContainer>
    </CustomTransition>
  );
};
