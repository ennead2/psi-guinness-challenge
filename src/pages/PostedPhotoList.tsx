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
      const _users = querySnapshot.docs.map((doc) => doc.data());
      // date型に変換
      _users.forEach((user) => (user.postedAt = user.postedAt.toDate()));
      // 昇順に並び替え
      _users.sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());
      // 全ユーザー数を登録
      setTotalUsers(_users.length);
      // 全投稿数を登録
      setTotalPosts(
        _users.reduce((acc, user) => ("postedAt" in user ? acc + 1 : acc), 0)
      );
      // ユーザー情報を登録
      setUsers(_users as User[]);
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
          onClick={() => navigate(-1)}
          position={"absolute"}
          top={6}
          left={4}
        />
        <Text fontSize={"3xl"} p={4}>
          投稿画像一覧
        </Text>

        <Stack w={"100%"}>
          <Text>ログインユーザー：{nickname}</Text>
          <Text>総ユーザー数：{totalUsers}</Text>
          <Text>総投稿数：{totalPosts}</Text>
        </Stack>

        <Stack direction={"row"} w={"100%"} m={4} justify={"space-evenly"}>
          <CustomButton
            type="select"
            onClick={() => navigate(route.selectContents)}
          >
            コンテンツ選択へ戻る
          </CustomButton>
          <CustomButton
            type="select"
            onClick={() => navigate(route.list.changeNickname)}
          >
            ニックネーム変更
          </CustomButton>
          <CustomButton type="select" onClick={() => auth.signOut()}>
            ログアウト
          </CustomButton>
        </Stack>

        <Spacer />

        <Stack h={"70%"} w={"100%"} bg={"gray.200"} rounded={"xl"} p={4}>
          {users.map((user) => (
            <Stack
              key={user.uid}
              w={"20%"}
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
