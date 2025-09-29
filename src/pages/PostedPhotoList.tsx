import { CustomTransition } from "@/components/customs/CustomTransition";
import { CustomContainer } from "@/components/customs/CustomContainer";
import { Spacer, Stack, Text, Image } from "@chakra-ui/react";
import { CustomButton } from "@/components/customs/CustomButton";
import { CustomDialog } from "@/components/customs/CustomDialog";
import { useNavigate } from "react-router-dom";
import { route } from "@/route/route";
import { useState, useEffect } from "react";
import { uidAtom } from "@/state/atom";
import { useAtomValue } from "jotai/react";
import { db, auth } from "@/firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

type User = {
  uid: string;
  nickname: string;
  photoUrl: string;
  thumbnailUrl: string;
  isNicknameSet: boolean;
  isPhotoSet: boolean;
  postedAt: Date;
};

type SelectedPhoto = {
  nickname: string;
  photoUrl: string;
  postedAt: Date;
};

export const PostedPhotoList = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhoto | null>(
    null
  );

  const uid = useAtomValue(uidAtom);

  //* ログインユーザー情報取得
  useEffect(() => {
    if (!uid) {
      setNickname("匿名ログイン中");
      return;
    }
    (async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        if ("nickname" in userDoc.data()) {
          setNickname(userDoc.data().nickname);
        } else {
          setNickname("ニックネーム未設定");
        }
      }
    })();
  }, [uid]);

  //* 投稿画像取得
  useEffect(() => {
    (async () => {
      // 全ユーザー情報取得
      //todo 取得に時間がかかる場合、初期取得件数を制限する
      const querySnapshot = await getDocs(collection(db, "users"));
      const allUsers = querySnapshot.docs.map((doc) => doc.data());
      // 全ユーザー数を登録
      setTotalUsers(allUsers.length);
      // 投稿済みのものだけを抽出し投稿数を記録
      const postedUsers = allUsers.filter((user) => "postedAt" in user);
      setTotalPosts(postedUsers.length);
      // date型に変換
      postedUsers.forEach((user) => (user.postedAt = user.postedAt.toDate()));
      // 昇順に並び替え
      postedUsers.sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());
      // ユーザー情報を登録
      setUsers(postedUsers as User[]);
    })();
  }, [uid]);

  //* 選択された画像を取得
  useEffect(() => {
    if (!selectedUid) return;

    const user = users.find((user) => user.uid === selectedUid);
    if (!user) return;
    setSelectedPhoto({
      nickname: user.nickname,
      photoUrl: user.photoUrl,
      postedAt: user.postedAt,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUid]);

  return (
    <CustomTransition>
      <CustomContainer>
        <CustomButton
          type="back"
          onClick={() => navigate(route.selectContents)}
          position={"absolute"}
          top={6}
          left={4}
        />
        <Text fontSize={"3xl"} p={4}>
          投稿画像一覧
        </Text>

        <Stack w={"100%"}>
          <Stack direction={"row"} justify={"space-between"} align={"center"}>
            <Text>ユーザー：{nickname}</Text>
            <CustomButton
              type="ok"
              px={2}
              py={0}
              w={"fit-content"}
              onClick={() => navigate(route.list.changeNickname)}
            >
              ニックネーム変更
            </CustomButton>
          </Stack>
          <Text>総ユーザー数：{totalUsers}</Text>
          <Stack direction={"row"} justify={"space-between"} align={"center"}>
            <Text>総投稿数：{totalPosts}</Text>
            <CustomButton
              type="cancel"
              px={2}
              py={0}
              w={"fit-content"}
              onClick={() => {
                auth.signOut();
                navigate(route.auth.signIn);
              }}
            >
              ログアウト
            </CustomButton>
          </Stack>
        </Stack>

        <Spacer />

        <Stack
          h={"70%"}
          w={"100%"}
          bg={"gray.200"}
          direction={"row"}
          rounded={"xl"}
          p={4}
        >
          {users.map((user) => (
            <Stack
              key={user.uid}
              w={"33%"}
              h={"fit-content"}
              bg={"white"}
              rounded={"md"}
              p={2}
              onClick={() => {
                setSelectedUid(user.uid);
                setIsOpen(true);
              }}
              cursor={"pointer"}
            >
              <Image
                src={user.thumbnailUrl}
                alt=""
                minH={"100px"}
                fit={"contain"}
              />
              <Text>{user.nickname}</Text>
              <Text>
                {user.postedAt
                  .toLocaleString()
                  .substring(5, user.postedAt.toLocaleString().length - 3)}
              </Text>
            </Stack>
          ))}
        </Stack>

        <CustomDialog isOpen={isOpen} setIsOpen={setIsOpen}>
          {selectedUid && (
            <Stack>
              <Image
                src={selectedPhoto?.photoUrl}
                h={"500px"}
                fit={"contain"}
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
