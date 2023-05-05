import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import { WalletComponent } from './wallet';
import { Wallet } from '../../interfaces/wallet';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

const getWallets = async (orderBy: string) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/wallet`, {
    params: {
      orderBy:
        orderBy === 'favorite' ? { isFavorite: 'desc' } : { createdAt: 'desc' },
    },
  });
  return data;
};

const createWallet = async (address: string) => {
  const { data: response } = await axios.post(
    `${process.env.REACT_APP_API_URL}/wallet`,
    { address }
  );
  return response.data;
};

const deleteWallet = async (walletId: string) => {
  const { data: response } = await axios.delete(
    `${process.env.REACT_APP_API_URL}/wallet/${walletId}`
  );
  return response;
};

export const WalletList = () => {
  const [newAddress, setNewAddress] = useState<string>();
  const [orderBy, setOrderBy] = useState('noOrder');

  const queryClient = useQueryClient();
  const { mutate: mutateCreate, isLoading: isLoadingCreate } = useMutation(
    createWallet,
    {
      onSuccess: () => {
        setNewAddress(undefined);
        message.open({
          type: 'success',
          content: 'Wallet created',
        });
        refetch();
      },
      onError: (error: any) => {
        message.open({
          type: 'error',
          content: error?.response?.data?.message ?? 'There was an error',
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['createWallet']);
      },
    }
  );

  const { mutate: mutateDelete } = useMutation(deleteWallet, {
    onSuccess: () => {
      message.open({
        type: 'success',
        content: 'Wallet deleted',
      });
      refetch();
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'There was an error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['createWallet']);
    },
  });

  const { data, status, refetch } = useQuery(['wallets', orderBy], () =>
    getWallets(orderBy)
  );

  useEffect(() => {
    refetch();
  }, [orderBy, refetch]);

  if (status === 'loading') return <Spin />;

  if (status === 'error')
    return <Alert type="error" message="Error retrieving wallets" />;

  const wallets: Wallet[] = data;

  const handleOnChangeNewAddress = (value: string) => {
    setNewAddress(value);
  };

  const handleAddWallet = () => {
    if (!newAddress) return;
    mutateCreate(newAddress);
  };

  const handleSetOrder = (value: string) => {
    setOrderBy(value);
  };

  const handleDeleteWallet = (walletId: string) => {
    mutateDelete(walletId);
  };

  return (
    <div>
      <Typography.Title level={2}>Wallets</Typography.Title>
      <Space direction="vertical" size="large">
        <Space size="large" wrap>
          <Space.Compact>
            <Input
              value={newAddress}
              placeholder="Input wallet address"
              onChange={(e) => handleOnChangeNewAddress(e.target.value)}
              style={{ width: '350px' }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddWallet}
              loading={isLoadingCreate}
            >
              Add wallet
            </Button>
          </Space.Compact>
          <Select
            value={orderBy}
            style={{ width: 150 }}
            onChange={handleSetOrder}
            options={[
              { value: 'noOrder', label: 'No order' },
              { value: 'favorite', label: 'Favorite first' },
            ]}
          />
        </Space>
        {wallets?.length ? (
          <Space size="large" wrap>
            {wallets.map((w) => (
              <WalletComponent
                key={w.id}
                wallet={w}
                onDelete={handleDeleteWallet}
              />
            ))}
          </Space>
        ) : (
          <Empty />
        )}
      </Space>
    </div>
  );
};
