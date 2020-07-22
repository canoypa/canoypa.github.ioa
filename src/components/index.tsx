import { h, FunctionComponent } from "preact";
import { SocialButton } from "./SocialButton/SocialButton";
import styles from "./styles.scss";

export const App: FunctionComponent = () => (
  <main class={styles.main}>
    <SocialButton type="GitHub" />
    <SocialButton type="NPM" />
    <SocialButton type="Qiita" />
    <SocialButton type="Twitter" />
  </main>
);
