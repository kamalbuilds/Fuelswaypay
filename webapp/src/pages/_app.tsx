import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import { LayoutProvider } from 'src/components/LayoutProvider';
import { store } from 'src/controller/store';
import "../styles/app.css";
import Router from "next/router";
import NProgress from "nprogress";
import withTheme from 'src/theme';

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

    <Provider store={store}>

      {

        withTheme(<LayoutProvider>
            <Component {...pageProps} />
        </LayoutProvider>)
      }
    </Provider >
  )
}
