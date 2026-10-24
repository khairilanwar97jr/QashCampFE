import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function AddOnImage({ addon, className }) {
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!expanded) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  return (
    <>
      <button
        type="button"
        aria-label={`Enlarge ${addon.name} image`}
        className="cursor-zoom-in rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
        onClick={(event) => {
          event.stopPropagation();
          setExpanded(true);
        }}
      >
        <img
          src={addon.imageUrl || "https://via.placeholder.com/150"}
          alt={addon.name}
          className={className}
          loading="lazy"
          decoding="async"
        />
      </button>
      {expanded && createPortal(
        <dialog
          ref={dialogRef}
          aria-label={`${addon.name} image preview`}
          className="fixed inset-0 m-auto w-[94vw] max-w-4xl max-h-[92dvh] rounded-2xl bg-stone-950 p-3 text-white shadow-2xl backdrop:bg-black/80"
          onCancel={() => setExpanded(false)}
          onClick={(event) => {
            event.stopPropagation();
            if (event.target === event.currentTarget) setExpanded(false);
          }}
        >
          <div className="flex items-center justify-between gap-4 pb-3">
            <p className="pl-2 text-sm font-semibold">{addon.name}</p>
            <button
              type="button"
              autoFocus
              aria-label="Close image preview"
              className="min-h-11 min-w-11 rounded-full bg-white/15 text-2xl hover:bg-white/25"
              onClick={() => setExpanded(false)}
            >
              ×
            </button>
          </div>
          <img
            src={addon.imageUrl || "https://via.placeholder.com/150"}
            alt={addon.name}
            className="max-h-[74dvh] w-full rounded-lg object-contain"
          />
        </dialog>,
        document.body
      )}
    </>
  );
}
