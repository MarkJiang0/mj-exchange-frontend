import ResetCSS from "@/ResetCSS";
import ModalProvider from "@/components/Modal/ModalContext";
import GlobalStyle from "@/components/globalstyles";
import api from "@/services/api";
import type { AppProps } from "next/app";
import { StompSessionProvider } from "react-stomp-hooks";
import { ThemeProvider, type DefaultTheme } from "styled-components";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
  },
};
export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <ThemeProvider theme={theme}>
        <StompSessionProvider url={'http://127.0.0.1:6004' + api.market.ws}>
          <ModalProvider>
            <ResetCSS />
            <GlobalStyle />
            <ToastContainer position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"/>
              {/* <Updater /> */}
            <Component {...pageProps} />
          </ModalProvider>
        </StompSessionProvider>
        
        
      </ThemeProvider>
    </>
  );
}
