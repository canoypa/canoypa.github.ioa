import Head from "next/head";
import { SocialButtonList } from "../components/SocialButtonList";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home | canoypa.github.io</title>
        <meta
          name="description"
          content="This is my website.
      Currently, only links to each profile exist."
        />
      </Head>

      <main className={styles.main}>
        <SocialButtonList />
      </main>
    </div>
  );
}
