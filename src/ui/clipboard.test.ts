import { canShare, copyText } from "./clipboard";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("copyText", () => {
  // req: REQ-ROOM-008
  it("falls back to writeText when ClipboardItem is missing", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await copyText(Promise.resolve("link"));
    expect(writeText).toHaveBeenCalledWith("link");
  });

  // req: REQ-ROOM-008
  it("falls back to a selection copy and rejects when that fails too", async () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
    await expect(copyText("a")).resolves.toBeUndefined();
    await expect(copyText("b")).rejects.toThrow();
  });
});

describe("canShare", () => {
  // req: REQ-ROOM-008
  it("needs a touch device with navigator.share", () => {
    vi.stubGlobal("navigator", { share: vi.fn() });
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
    expect(canShare()).toBe(true);
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as never;
    expect(canShare()).toBe(false);
  });
});
