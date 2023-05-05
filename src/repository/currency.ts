import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const getCurrencies = async () => {
  const { data } = await axios.get(`${apiUrl}/currency`);
  return data;
};

export const updateCurrency = async (params: {
  currencyId: string;
  rate: number;
}) => {
  const { currencyId, rate } = params;
  const { data: response } = await axios.patch(
    `${apiUrl}/currency/${currencyId}`,
    { rate }
  );
  return response;
};
