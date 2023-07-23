import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <title>Swaypay - A payment application for both DAOs and Individuals</title>
                <meta name="title" content="A payment application for both DAOs and Individuals"></meta>
                <meta name="description" content="Swaypay - A2N Finance"></meta>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                />
                <meta property="og:url" content="https://swaypay.a2n.finance/"></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}