import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMetadata } from "../pageMetadata";

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getPageMetadata(pathname);
    document.title = meta.title;
    for (const [selector, value] of [
      ['meta[name="description"]', meta.description],
      ['meta[property="og:title"]', meta.title],
      ['meta[property="og:description"]', meta.description],
      ['meta[property="og:image"]', new URL(meta.image, window.location.origin).href],
    ]) document.querySelector(selector)?.setAttribute("content", value);
  }, [pathname]);
  return null;
}
