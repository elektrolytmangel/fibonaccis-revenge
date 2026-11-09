/**
 * Copy a text that is produced on demand. Safari on iOS only allows copying inside the tap
 * that started it, so the (maybe slow) text is handed over as a promise instead of being
 * awaited first. Rejects when copying is not possible; the caller then shows the text.
 */
export async function copyText(text: string | Promise<string>): Promise<void> {
  const clipboard = navigator.clipboard;
  if (!clipboard) throw new Error("no clipboard");
  if (typeof ClipboardItem !== "undefined" && clipboard.write) {
    const blob = Promise.resolve(text).then((t) => new Blob([t], { type: "text/plain" }));
    try {
      await clipboard.write([new ClipboardItem({ "text/plain": blob })]);
      return;
    } catch {
      /* fall through to writeText */
    }
  }
  await clipboard.writeText(await text);
}
