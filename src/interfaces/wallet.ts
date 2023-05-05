export interface Wallet {
  id: string;
  address: string;
  isFavorite: boolean;
  balance: number;
  isOld: boolean;
  createdAt: Date;
}
