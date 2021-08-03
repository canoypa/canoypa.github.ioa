import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.scss";

const socialTypes = {
  GitHub: {
    label: "GitHub",
    link: "https://github.com/canoypa",
    srcName: "github",
  },
  NPM: {
    label: "NPM",
    link: "https://npmjs.com/~cano",
    srcName: "npm",
  },
  Qiita: {
    label: "Qiita",
    link: "https://qiita.com/canoypa",
    srcName: "qiita",
  },
  Twitter: {
    label: "Twitter",
    link: "https://twitter.com/canoypa",
    srcName: "twitter",
  },
} as const;

type SocialTypeKeys = keyof typeof socialTypes;

type Props = {
  type: SocialTypeKeys;
};
export const SocialButton: FC<Props> = ({ type }) => {
  const social = socialTypes[type];

  return (
    <Link href={social.link}>
      <a className={styles.main}>
        <div className={styles.container}>
          <div className={styles.primary}>
            <picture className={styles.logo}>
              <source
                type="image/webp"
                srcSet={`/assets/logos/${social.srcName}.webp`}
              />
              <img
                src={`/assets/logos/${social.srcName}.png`}
                width="32"
                height="32"
                alt=""
              />
            </picture>
            <span>{social.label}</span>
          </div>
        </div>
      </a>
    </Link>
  );
};
