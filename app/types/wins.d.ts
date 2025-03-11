export type Win = {
  key: string;
  amount: number;
  currency: string;
  userNickname: string;
  game: {
    id: number;
    imageUrl: string;
    name: string;
  };
};
