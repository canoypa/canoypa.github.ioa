import { FC } from "react";
import { SocialButton } from "../SocialButton";
import styles from "./styles.module.scss";

export const SocialButtonList: FC = () => (
  <div className={styles.main}>
    <SocialButton type="GitHub" />
    <SocialButton type="NPM" />
    <SocialButton type="Qiita" />
    <SocialButton type="Twitter" />
  </div>
);
