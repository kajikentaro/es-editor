import Router from "next/router";
import { useEffect } from "react";

const ALERT_MESSAGE = "内容を保存せずに終了しますか？";

const beforeUnloadhandler = (event: BeforeUnloadEvent) => {
  event.returnValue = ALERT_MESSAGE;
};

const useUnsaveAlert = (isMustWarn: boolean) => {
  useEffect(() => {
    const routeChangeStart = () => {
      if (isMustWarn && !window.confirm(ALERT_MESSAGE)) {
        throw "canceled by user to prevent lost data";
      }
    };

    if (isMustWarn) {
      window.addEventListener("beforeunload", beforeUnloadhandler);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadhandler);
    }
    Router.events.on("routeChangeStart", routeChangeStart);

    return () => {
      Router.events.off("routeChangeStart", routeChangeStart);
      window.removeEventListener("beforeunload", beforeUnloadhandler);
    };
  }, [isMustWarn]);
};

export default useUnsaveAlert;
