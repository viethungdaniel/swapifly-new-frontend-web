import { Children } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import { createEmotionCacheApp, createEmotionCacheMui } from "@/libs";
import nextI18nextConfig from "@@/next-i18next.config";
import { commonConfig } from "@/utils/config";

export default class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale ?? nextI18nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head>
          {commonConfig.GOOGLE_ADS_CLIENT_ID && (
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${commonConfig.GOOGLE_ADS_CLIENT_ID}`}
              crossOrigin="anonymous"
            ></script>
          )}
          {commonConfig.GOOGLE_ANALYTICS_MEASUREMENT_ID && (
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${commonConfig.GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
              crossOrigin="anonymous"
            ></script>
          )}
          <script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${commonConfig.GOOGLE_ANALYTICS_MEASUREMENT_ID}', {
                  page_title: window.location.title,
                  page_location: window.location.href,
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.NextPublic = ${JSON.stringify({
                  lang: currentLocale,
                  version: commonConfig.APP_VERSION,
                } as typeof window.NextPublic)}
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const emotionCacheMui = createEmotionCacheMui();
  const emotionCacheApp = createEmotionCacheApp();
  const { extractCriticalToChunks: extractCriticalToChunksMui } =
    createEmotionServer(emotionCacheMui);
  const { extractCriticalToChunks: extractCriticalToChunksApp } =
    createEmotionServer(emotionCacheApp);

  /* eslint-disable */
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props) =>
        (
          <App
            emotionCacheMui={emotionCacheMui}
            emotionCacheApp={emotionCacheApp}
            {...props}
          />
        ),
    });
  /* eslint-enable */

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStylesApp = extractCriticalToChunksMui(initialProps.html);
  const emotionStyleTagsApp = emotionStylesApp.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  const emotionStylesMui = extractCriticalToChunksApp(initialProps.html);
  const emotionStyleTagsMui = emotionStylesMui.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    app: {},
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...Children.toArray(initialProps.styles),
      ...emotionStyleTagsApp,
      ...emotionStyleTagsMui,
    ],
  };
};
