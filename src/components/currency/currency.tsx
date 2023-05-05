import { Button, Card, Input, Space, Typography, message } from 'antd';
import { Currency } from '../../interfaces/currency';
import { useState } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateCurrency = async (params: { currencyId: string; rate: number }) => {
  const { currencyId, rate } = params;
  const { data: response } = await axios.patch(
    `${process.env.REACT_APP_API_URL}/currency/${currencyId}`,
    { rate }
  );
  return response;
};

interface CurrencyComponentProps {
  currency: Currency;
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>; //(currencies: Currency[]) => void;
}

export const CurrencyComponent = ({
  currency,
  setCurrencies,
}: CurrencyComponentProps) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [rate, setRate] = useState(currency.rate.toString());

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateCurrency, {
    onSuccess: () => {
      setCurrencies((currencies: Currency[]) =>
        currencies.map((c) => ({
          ...c,
          rate: c.id === currency.id ? Number.parseFloat(rate) : c.rate,
        }))
      );
      message.open({
        type: 'success',
        content: 'Currency updated',
      });
    },
    onError: () => {
      message.open({
        type: 'error',
        content: 'There was an error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['updateCurrency']);
    },
  });

  const handleOnChange = (value: string) => {
    setRate(value ?? '');
  };

  const handleOnSave = () => {
    mutate({ currencyId: currency.id, rate: Number.parseFloat(rate) });
    setIsReadOnly(true);
  };

  const handleOnCancel = () => {
    setRate(currency.rate.toString());
    setIsReadOnly(true);
  };

  return (
    <Card key={currency.id} style={{ width: 350 }}>
      <Space>
        <Typography.Text type="secondary">{currency.currency}</Typography.Text>
        {isReadOnly ? (
          <Typography.Text strong>{rate}</Typography.Text>
        ) : (
          <Input
            type="number"
            style={{ width: 180 }}
            value={rate}
            min="0"
            max="10"
            step="0.01"
            onChange={(e) => handleOnChange(e.target.value)}
          />
        )}
        {isReadOnly ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsReadOnly(false)}
          />
        ) : (
          <>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleOnSave}
              loading={isLoading}
            />
            <Button icon={<CloseOutlined />} onClick={handleOnCancel} />
          </>
        )}
      </Space>
    </Card>
  );
};
