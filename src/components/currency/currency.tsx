import { Button, Card, Input, Space, Typography } from 'antd';
import { Currency } from '../../interfaces/currency';
import { useState } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useUpdateCurrency } from '../../hooks/currency';

interface CurrencyComponentProps {
  currency: Currency;
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
}

export const CurrencyComponent = ({
  currency,
  setCurrencies,
}: CurrencyComponentProps) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [rate, setRate] = useState(currency.rate.toString());

  const { mutate, isLoading } = useUpdateCurrency(
    currency.id,
    rate,
    setCurrencies
  );

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
