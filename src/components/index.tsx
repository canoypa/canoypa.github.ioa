import { FC, h } from "preact";
import { SocialButton } from "./SocialButton";
import styles from "./styles.scss";

export const App: FC = () => (
  <main class={styles.main}>
    <SocialButton type="GitHub" />
    <SocialButton type="NPM" />
    <SocialButton type="Qiita" />
    <SocialButton type="Twitter" />
  </main>
);
