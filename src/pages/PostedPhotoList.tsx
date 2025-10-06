import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Stack, Text, Image, SimpleGrid, Box } from "@chakra-ui/react";
import { CustomDialog } from "@/components/customs/CustomDialog";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

type User = {
  uid: string;
  nickname: string;
  photoUrl: string;
  thumbnailUrl: string;
  isNicknameSet: boolean;
  isPhotoSet: boolean;
  rotation: number;
  postedAt: Date;
};

type SelectedPhoto = {
  nickname: string;
  photoUrl: string;
  rotation: number;
  postedAt: Date;
};

export const PostedPhotoList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhoto | null>(
    null
  );

  //* 投稿画像取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      async (snapshot) => {
        // 全ユーザー情報取得
        const allUsers = snapshot.docs.map((doc) => doc.data());
        // 全ユーザー数を登録
        setTotalUsers(allUsers.length);
        // 投稿済みのものだけを抽出し投稿数を記録
        const postedUsers = allUsers.filter((user) => "postedAt" in user);
        setTotalPosts(postedUsers.length);
        // date型に変換
        postedUsers.forEach((user) => (user.postedAt = user.postedAt.toDate()));
        // 昇順に並び替え
        postedUsers.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
        // 回転情報を追加
        postedUsers.forEach((data) => {
          if ("rotation" in data) return;
          data.rotation = 0;
        });
        // ユーザー情報を登録
        setUsers(postedUsers as User[]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  //* 選択された画像を取得
  useEffect(() => {
    if (!selectedUid) return;

    const user = users.find((user) => user.uid === selectedUid);
    if (!user) return;
    setSelectedPhoto({
      nickname: user.nickname,
      photoUrl: user.photoUrl,
      rotation: user.rotation,
      postedAt: user.postedAt,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUid]);

  return (
    <CustomTransition>
      <CustomContainer type="main" justify={"start"}>
        <Text fontSize={"3xl"} p={4}>
          投稿写真一覧
        </Text>

        <Stack w={"100%"} mb={4}>
          <Stack direction={"row"} align={"center"} gap={6}>
            <Text>総ユーザー数：{totalUsers}</Text>
            <Text>総投稿数：{totalPosts}</Text>
          </Stack>
        </Stack>

        <SimpleGrid columns={3} gap={1}>
          {users.map((user) => (
            <Stack
              key={user.uid}
              w={"100%"}
              h={"fit-content"}
              bg={"white"}
              rounded={"md"}
              p={1}
              onClick={() => {
                setSelectedUid(user.uid);
                setIsOpen(true);
              }}
              cursor={"pointer"}
              shadow="sm"
              _hover={{ shadow: "md", transform: "scale(1.02)" }}
              transition="all 0.2s"
            >
              <Box
                w="100%"
                h="120px" // 👈 好きな固定高さに調整
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={user.thumbnailUrl}
                  alt=""
                  objectFit="contain"
                  maxW="100%"
                  maxH="100%"
                  transform={`rotate(${user.rotation}deg)`}
                  transformOrigin="center center" // 👈 回転の基点を中央に
                />
              </Box>
              <Text>{user.nickname}</Text>
              <Text>
                {user.postedAt
                  .toLocaleString()
                  .substring(5, user.postedAt.toLocaleString().length - 3)}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>

        <CustomDialog isOpen={isOpen} setIsOpen={setIsOpen}>
          {selectedUid && (
            <Stack>
              <Image
                src={selectedPhoto?.photoUrl}
                h={"500px"}
                fit={"contain"}
                transform={`rotate(${selectedPhoto?.rotation}deg)`}
              />
              <Text>投稿ユーザー：{selectedPhoto?.nickname}</Text>
              <Text>投稿日時：{selectedPhoto?.postedAt.toLocaleString()}</Text>
            </Stack>
          )}
        </CustomDialog>
      </CustomContainer>
    </CustomTransition>
  );
};
