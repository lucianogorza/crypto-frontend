import { useContext, useEffect } from 'react';
import { Alert, Space, Spin, Typography } from 'antd';
import { CurrencyComponent } from './currency';
import CurrencyContext, {
  CurrencyContextType,
} from '../../contexts/currencyContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const getCurrencies = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/currency`);
  return data;
};

export const CurrencyList = () => {
  const { data, status } = useQuery(['currencies'], getCurrencies);

  const { currencies, setCurrencies } = useContext(
    CurrencyContext
  ) as CurrencyContextType;

  useEffect(() => {
    data && setCurrencies(data);
  }, [data, setCurrencies]);

  if (status === 'loading') return <Spin />;

  if (status === 'error')
    return <Alert type="error" message="Error retrieving currencies" />;

  return (
    <div>
      <Typography.Title level={4}>Currency rates</Typography.Title>
      <Space size="large" wrap>
        {currencies.map((c) => (
          <CurrencyComponent
            key={c.id}
            currency={c}
            setCurrencies={setCurrencies}
          />
        ))}
      </Space>
    </div>
  );
};
