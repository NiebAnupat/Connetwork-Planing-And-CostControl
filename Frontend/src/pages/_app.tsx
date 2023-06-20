import { AppProps } from "next/app";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Global, MantineProvider } from "@mantine/core";
import Layout from "@/components/Layout/Layout";

function FontStyles() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "Noto Sans Thai",
            src: `url("https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/NotoSansThai/NotoSansThai-Regular.woff2") format("woff2")`,
            fontStyle: "normal",
            fontWeight: "normal",
            fontDisplay: "swap",
          },
        },
      ]}
    />
  );
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          fontFamily: "Noto Sans Thai",
          breakpoints: {
            xs: "30em",
            sm: "48em",
            md: "64em",
            lg: "74em",
            xl: "90em",
          },
        }}
      >
        <FontStyles />
        <Notifications limit={5} />

        <ModalsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
