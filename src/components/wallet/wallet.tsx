import { useContext } from 'react';
import {
  Card,
  Divider,
  Modal,
  Popover,
  Rate,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd';
import { Wallet } from '../../interfaces/wallet';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CurrencyContext, {
  CurrencyContextType,
} from '../../contexts/currencyContext';

const updateWallet = async (params: {
  isFavorite: boolean;
  walletId: string;
}) => {
  const { isFavorite, walletId } = params;
  const { data: response } = await axios.patch(
    `${process.env.REACT_APP_API_URL}/wallet/${walletId}`,
    { isFavorite }
  );
  return response;
};

interface WalletComponentProps {
  wallet: Wallet;
  onDelete: (walletId: string) => void;
}

export const WalletComponent = ({ wallet, onDelete }: WalletComponentProps) => {
  const { id, address, isOld, balance } = wallet;

  const [seletedCurrencyId, setSelectedCurrencyId] = useState<string>();
  const [isFavorite, setisFavorite] = useState<boolean>(wallet.isFavorite);

  const { currencies } = useContext(CurrencyContext) as CurrencyContextType;

  useEffect(() => {
    currencies?.length &&
      !seletedCurrencyId &&
      setSelectedCurrencyId(currencies[0].id);
  }, [currencies, seletedCurrencyId]);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateWallet, {
    onSuccess: () => {},
    onError: () => {
      setisFavorite(!isFavorite);
      message.open({
        type: 'error',
        content: 'There was an error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['updateWallet']);
    },
  });

  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: 'Delete wallet',
      icon: <ExclamationCircleFilled />,
      content: `Are you sure delete wallet ${address}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(id);
      },
    });
  };

  const handleChangeCurrency = (currencyId: string) => {
    setSelectedCurrencyId(currencyId);
  };

  const handleSetFavorite = async (value: number) => {
    setisFavorite(value === 1 ? true : false);
    mutate({ isFavorite: value === 1 ? true : false, walletId: id });
  };

  return (
    <Card
      key={wallet.id}
      title={
        <Popover
          content={<Typography.Text copyable>{address}</Typography.Text>}
        >
          <Typography.Text>{address}</Typography.Text>
        </Popover>
      }
      extra={
        <Space style={{ marginLeft: '5px' }}>
          {isOld && <Tag color="red">OLD</Tag>}
          <Rate
            count={1}
            value={isFavorite ? 1 : 0}
            disabled={isLoading}
            onChange={handleSetFavorite}
          />
        </Space>
      }
      actions={[<DeleteOutlined key="delete" onClick={showDeleteConfirm} />]}
      style={{ width: 350 }}
    >
      <Statistic
        title="Balance"
        value={balance}
        precision={2}
        suffix={<Typography.Text type="secondary">ETH</Typography.Text>}
      />
      {currencies?.length ? (
        <>
          <Divider />
          <Statistic
            value={
              balance *
              (currencies?.find((c) => c.id === seletedCurrencyId)?.rate ?? 0)
            }
            precision={2}
            suffix={
              <Select
                value={seletedCurrencyId}
                style={{ width: 80 }}
                onChange={handleChangeCurrency}
                options={currencies.map((c) => ({
                  value: c.id,
                  label: c.currency,
                }))}
              />
            }
          />
        </>
      ) : null}
    </Card>
  );
};
