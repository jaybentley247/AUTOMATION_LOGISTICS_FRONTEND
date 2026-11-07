import { useEffect } from "react";

const JIVO_WIDGET_ID = ""; // Paste your Jivo widget ID here (from code.jivosite.com/widget/XXXXXXXXXX)

export default function ChatWidget() {
  useEffect(() => {
    if (!JIVO_WIDGET_ID) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://code.jivosite.com/script/widget/${JIVO_WIDGET_ID}`;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
