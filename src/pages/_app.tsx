import { CacheProvider } from "@emotion/react";
import { EmotionCache } from "@emotion/utils";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import createEmotionCache from "../core/emotion-cache";

type Props = AppProps & {
  emotionCache?: EmotionCache;
};
function MyApp({
  Component,
  pageProps,
  emotionCache = createEmotionCache(),
}: Props) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
export default MyApp;
