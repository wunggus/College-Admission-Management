import React from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import AppRouter from './routes/AppRouter';
import { initializeSampleData } from './data/sampleData';
// Ignore missing type declarations for this side-effect CSS import
// @ts-ignore
import './index.css';

// Initialize sample data on app start
initializeSampleData();

const App: React.FC = () => {
  return (
    <ConfigProvider locale={enUS}>
      <AppRouter />
    </ConfigProvider>
  );
};

export default App;