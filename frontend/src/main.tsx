import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './styles/index.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

const theme = createTheme({
   palette: {
      primary: {
         main: '#1976d2',
      },
      secondary: {
         main: '#dc004e',
      },
   },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <Provider store={store}>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
         </ThemeProvider>
      </Provider>
   </React.StrictMode>
);
