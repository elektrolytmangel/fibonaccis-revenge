/** True on touch devices that offer the system share sheet (iOS, Android). */
export function canShare(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/** Open the system share sheet. Resolves false when the user dismisses it; rejects on errors. */
export async function shareUrl(url: string, title: string): Promise<boolean> {
  try {
    await navigator.share({ title, url });
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return false;
    throw e;
  }
}

/** Old-style copy through a temporary selected textarea; works without the async Clipboard API. */
function copyViaSelection(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  document.body.appendChild(area);
  const active = document.activeElement as HTMLElement | null;
  try {
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    return typeof document.execCommand === "function" && document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
    active?.focus?.();
  }
}

/**
 * Copy a text that is produced on demand. Safari on iOS only allows copying inside the tap
 * that started it, so the (maybe slow) text is handed over as a promise first. Falls back to
 * `writeText`, then to a selection copy (also works on plain http). Rejects when nothing
 * worked; the caller then shows the text so it can be copied by hand.
 */
export async function copyText(text: string | Promise<string>): Promise<void> {
  const clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
  if (clipboard && typeof ClipboardItem !== "undefined" && clipboard.write) {
    const blob = Promise.resolve(text).then((t) => new Blob([t], { type: "text/plain" }));
    try {
      await clipboard.write([new ClipboardItem({ "text/plain": blob })]);
      return;
    } catch {
      /* fall through */
    }
  }
  const value = await text;
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(value);
      return;
    } catch {
      /* fall through */
    }
  }
  if (!copyViaSelection(value)) throw new Error("copy failed");
}
