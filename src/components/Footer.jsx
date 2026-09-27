import { useEffect, useRef } from "react";

export default function Footer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!document.querySelector('script[src*="i-mobile.co.jp"]')) {
      const script = document.createElement("script");
      script.src = "https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104";
      script.async = true;
      document.body.appendChild(script);
    }

    try {
      (window.adsbyimobile = window.adsbyimobile || []).push({
        pid: 84353,
        mid: 591786,
        asid: 1927041,
        type: "banner",
        display: "inline",
        elementid: "im-094fc873c2634f4f94daed174b522d62"
      });
    } catch (e) {
      console.error("i-mobile ad initialization failed:", e);
    }
  }, []);

  return (
    <footer className="app-footer">
      <div id="im-094fc873c2634f4f94daed174b522d62" className="ad-container"></div>
    </footer>
  );
}
