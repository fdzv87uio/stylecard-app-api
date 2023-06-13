import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link
                    href="https://fonts.cdnfonts.com/css/segoe-ui-4"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.cdnfonts.com/css/gilroy-bold"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
