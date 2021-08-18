import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.scss";

type Props = {
  label: string;
  link: string;
  srcName: string;
};
export const SocialButton: FC<Props> = ({ label, link, srcName }) => {
  return (
    <Link href={link}>
      <a className={styles.main}>
        <div className={styles.container}>
          <div className={styles.primary}>
            <picture className={styles.logo}>
              <source
                type="image/webp"
                srcSet={`/_/assets/logos/${srcName}.webp`}
              />
              <img
                src={`/_/assets/logos/${srcName}.png`}
                width="32"
                height="32"
                alt=""
              />
            </picture>
            <span>{label}</span>
          </div>
        </div>
      </a>
    </Link>
  );
};
