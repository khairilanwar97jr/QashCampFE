export function getPageMetadata(pathname) {
  if (pathname.replace(/\/+$/, "") === "/check-availability") {
    return {
      title: "QashCamp | Check Tent Availability",
      description: "Select your camping dates and see which QashCamp tent packages are available.",
      image: "/logo_calendar.jpg",
    };
  }
  return {
    title: "QashCamp",
    description: "Explore QashCamp camping equipment rentals, tent packages, and camping stories.",
    image: "/logo.jpg",
  };
}

export function applyHtmlMetadata(html, pathname) {
  const meta = getPageMetadata(pathname);
  return html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${meta.description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${meta.title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${meta.description}`)
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1${meta.image}`);
}
