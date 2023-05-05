import {
  Alert,
  Button,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import { WalletComponent } from './wallet';
import { Wallet } from '../../interfaces/wallet';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  useCreateWallet,
  useDeleteWallet,
  useGetWallets,
} from '../../hooks/wallet';

export const WalletList = () => {
  const [newAddress, setNewAddress] = useState<string>();
  const [orderBy, setOrderBy] = useState('noOrder');

  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    useCreateWallet();

  const { mutate: mutateDelete } = useDeleteWallet();

  const { data, status, refetch } = useGetWallets(orderBy);

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
    setNewAddress(undefined);
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
              disabled={isLoadingCreate}
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
