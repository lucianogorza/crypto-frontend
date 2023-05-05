import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createWallet, deleteWallet, getWallets } from '../repository/wallet';

export const useGetWallets = (orderBy: string) => {
  const query = useQuery(['getWallets', orderBy], () => getWallets(orderBy));

  return query;
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  return useMutation(createWallet, {
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Wallet created',
      });
    },
    onError: (error: any) => {
      message.open({
        type: 'error',
        content: error?.response?.data?.message ?? 'There was an error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['getWallets']);
    },
  });
};

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteWallet, {
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Wallet deleted',
      });
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'There was an error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['getWallets']);
    },
  });
};
