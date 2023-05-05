import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { Currency } from '../interfaces/currency';
import { getCurrencies, updateCurrency } from '../repository/currency';

export const useGetCurrencies = () => {
  const query = useQuery(['getCurrencies'], getCurrencies);

  return query;
};

export const useUpdateCurrency = (
  currencyId: string,
  rate: string,
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>
) => {
  const queryClient = useQueryClient();

  return useMutation(updateCurrency, {
    onSuccess: () => {
      setCurrencies((currencies: Currency[]) =>
        currencies.map((c) => ({
          ...c,
          rate: c.id === currencyId ? Number.parseFloat(rate) : c.rate,
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
      queryClient.invalidateQueries(['getCurrencies']);
    },
  });
};
