import AppDialog from "@/components/AppDialog";

import FacebookPlayer from "react-player/facebook";

import useStyles from "./FacebookVideoDialog.styles";
import HtmlParser from "@/components/HtmlParser";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppDialogContent from "@/components/AppDialogContent";
import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks";

const FacebookContent = () => {
  const [facebookPlayerWidth, setFacebookPlayerWidth] = useState(0);
  const [facebookPlayerHeight, setFacebookPlayerHeight] = useState(0);

  const facebookContentAnchorRef = useRef<HTMLDivElement | null>(null);
  const facebookPlayerRef = useRef<any>();

  const { classes } = useStyles();

  useEffect(() => {
    const handleFacebookContentAnchorResize = () => {
      if (!!facebookContentAnchorRef.current) {
        setFacebookPlayerWidth(facebookContentAnchorRef.current.clientWidth);
        setFacebookPlayerHeight(facebookContentAnchorRef.current.clientHeight);
      }
    };
    const resizeFacebookContentAnchor = new ResizeObserver(
      handleFacebookContentAnchorResize
    );
    !!facebookContentAnchorRef.current &&
      resizeFacebookContentAnchor.observe(facebookContentAnchorRef.current);

    return () => {
      resizeFacebookContentAnchor.disconnect();
    };
  });

  useEffect(() => {}, [facebookPlayerWidth, facebookPlayerHeight]);

  return (
    <div ref={facebookContentAnchorRef} className={classes.facebookPlayer}>
      <FacebookPlayer
        key={`${facebookPlayerWidth}:${facebookPlayerHeight}`}
        ref={facebookPlayerRef}
        url={"https://www.facebook.com/Thuymy1510/videos/343790775175516/"}
        width={facebookPlayerWidth}
        height={facebookPlayerHeight}
        config={{
          attributes: {
            width: `${facebookPlayerWidth}px`,
            height: `${facebookPlayerHeight}px`,
          },
        }}
        playing
        muted
      />
    </div>
  );
};

const FacebookVideoDialog = () => {
  const { classes } = useStyles();

  return (
    <AppDialog
      open
      fullScreen
      keepMounted
      scroll="paper"
      mobileScroll="paper"
      classes={{
        paper: classes.dialogPaper,
      }}
    >
      <AppDialogTitle className={classes.dialogTitle}></AppDialogTitle>
      <AppDialogContent className={classes.dialogContent}>
        <FacebookContent />
      </AppDialogContent>
    </AppDialog>
  );
};

export default FacebookVideoDialog;
{
  /* <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2FThuymy1510%2Fvideos%2F343790775175516%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe> */
}
