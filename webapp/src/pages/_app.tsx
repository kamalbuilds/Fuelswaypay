import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import "../styles/app.css";
import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import { store } from 'src/controller/store';
import { LayoutProvider } from 'src/components/LayoutProvider';
const { defaultAlgorithm, darkAlgorithm } = theme;
import NProgress from "nprogress";
import Router from "next/router";

Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
})

Router.events.on("routeChangeComplete", (url) => {
    NProgress.done()
})

Router.events.on("routeChangeError", (url) => {
    NProgress.done()
})
export default function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#34d399',
        },
        components: {
          Menu: {
            iconSize: 20,
            fontSize: 16
          },
        },
        algorithm: defaultAlgorithm
      }}
    >
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <LayoutProvider>

          <Component {...pageProps} />

        </LayoutProvider>
        {/* </PersistGate> */}
      </Provider >
    </ConfigProvider>
  )
}
