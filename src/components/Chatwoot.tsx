"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
  }
}

export default function Chatwoot() {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `
      (function(d,t) {
        var BASE_URL="https://chatwoot.nitro.academy";
        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=BASE_URL+"/packs/js/sdk.js";
        g.async = true;
        s.parentNode.insertBefore(g,s);
        g.onload=function(){
          window.chatwootSDK.run({
            websiteToken: '5iAB3QJNzaNuAHiwwPjsvQfD',
            baseUrl: BASE_URL
          })
        }
      })(document,"script");
    `;

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
