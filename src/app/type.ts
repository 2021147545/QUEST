export type Quest = {
  id: string;
  quest: string;
  description: string;
  nickname: string;
  reward: string;
  exp: string;
  angel?: string | null;
};
