import { Layout, Space } from 'antd';
import { WalletList } from './wallet/walletList';
import { CurrencyList } from './currency/currencyList';
import CurrencyContext from '../contexts/currencyContext';
import { useState } from 'react';
import { Currency } from '../interfaces/currency';

export const AppLayout = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  return (
    <CurrencyContext.Provider value={{ currencies, setCurrencies }}>
      <Layout style={{ minHeight: '100vh', padding: '25px' }}>
        <Space direction="vertical" size="large">
          <CurrencyList />
          <WalletList />
        </Space>
      </Layout>
    </CurrencyContext.Provider>
  );
};
