import { Box } from "@mui/material";
import { FC } from "react";
import { SocialButton } from "../SocialButton";

export const SocialButtonList: FC = () => (
  <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
    <SocialButton
      label="GitHub"
      link="https://github.com/canoypa"
      srcName="github"
    />
    <SocialButton
      label="Twitter"
      link="https://twitter.com/canoypa"
      srcName="twitter"
    />
    <SocialButton label="Zenn" link="https://zenn.dev/canoypa" srcName="zenn" />
    <SocialButton
      label="Qiita"
      link="https://qiita.com/canoypa"
      srcName="qiita"
    />
  </Box>
);
