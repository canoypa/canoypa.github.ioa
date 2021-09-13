import { Box } from "@mui/material";
import Head from "next/head";
import { SocialButtonList } from "../components/SocialButtonList";

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

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={3}
        height="100vh"
      >
        <SocialButtonList />
      </Box>
    </div>
  );
}
