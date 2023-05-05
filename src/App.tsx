import type { FC } from 'react';
import 'antd/dist/reset.css';
import { AppLayout } from './components/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <div className="App">
      <AppLayout />
    </div>
  </QueryClientProvider>
);

export default App;
