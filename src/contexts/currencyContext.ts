import { createContext } from 'react';
import { Currency } from '../interfaces/currency';

export type CurrencyContextType = {
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export default CurrencyContext;
