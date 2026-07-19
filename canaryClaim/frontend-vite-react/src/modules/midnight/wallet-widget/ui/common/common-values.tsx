import { JSX } from "react";
import IconLace from "./icons/icon-lace";

export const walletsListFormat: {
    [key: string]: { key: string; displayName: string; icon: JSX.Element };
  } = {
    "1am": { key: "1am", displayName: "1AM", icon: <span className="font-semibold">1AM</span> },
    lace: { key: "mnLace", displayName: "LACE", icon: <IconLace /> },
  };

export enum networkID {
  UNDEPLOYED = "undeployed",
  PREVIEW = "preview", 
  PREPROD = "preprod",
  MAINNET = "mainnet"
}
