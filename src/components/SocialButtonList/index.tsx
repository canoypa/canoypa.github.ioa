import { FC } from "react";
import { SocialButton } from "../SocialButton";
import styles from "./styles.module.scss";

export const SocialButtonList: FC = () => (
  <div className={styles.main}>
    <SocialButton
      label="GitHub"
      link="https://github.com/canoypa"
      srcName="github"
    />
    <SocialButton label="NPM" link="https://npmjs.com/~cano" srcName="npm" />
    <SocialButton
      label="Qiita"
      link="https://qiita.com/canoypa"
      srcName="qiita"
    />
    <SocialButton
      label="Twitter"
      link="https://twitter.com/canoypa"
      srcName="twitter"
    />
  </div>
);
