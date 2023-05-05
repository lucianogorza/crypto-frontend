import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const getWallets = async (orderBy: string) => {
  const { data } = await axios.get(`${apiUrl}/wallet`, {
    params: {
      orderBy:
        orderBy === 'favorite' ? { isFavorite: 'desc' } : { createdAt: 'desc' },
    },
  });
  return data;
};

export const createWallet = async (address: string) => {
  const { data: response } = await axios.post(`${apiUrl}/wallet`, { address });
  return response.data;
};

export const deleteWallet = async (walletId: string) => {
  const { data: response } = await axios.delete(`${apiUrl}/wallet/${walletId}`);
  return response;
};
