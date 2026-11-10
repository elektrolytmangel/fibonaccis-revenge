import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { makeT } from "../i18n/i18n";
import { App } from "./App";

async function startRoom(name = "Marc") {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByLabelText(/your name/i), name);
  await user.click(screen.getByRole("button", { name: /create room/i }));
  return user;
}

beforeEach(() => {
  window.location.hash = "";
});

describe("app", () => {
  // req: REQ-PLAT-001
  it("renders the landing page", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /fibonacci/i })).toBeInTheDocument();
  });

  // req: REQ-ROOM-001
  it("creates a room and shows the creator as first participant", async () => {
    await startRoom();
    const people = screen.getByRole("list", { name: "Participants" });
    expect(within(people).getByText(/Marc \(you\)/)).toBeInTheDocument();
    expect(window.location.hash).toMatch(/^#\/room\/\w+$/);
  });

  // req: REQ-ROOM-005
  it("shows an optional room name in the header", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/your name/i), "Marc");
    await user.type(screen.getByLabelText(/room name/i), "Sprint 42");
    await user.click(screen.getByRole("button", { name: /create room/i }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sprint 42");
  });

  // req: REQ-ROOM-007
  it("leaves a room after confirmation and returns to the landing page", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = await startRoom();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(screen.getByRole("button", { name: "Leave room" }));
    expect(confirm).toHaveBeenCalled();
    expect(await screen.findByRole("button", { name: /create room/i })).toBeInTheDocument();
    confirm.mockRestore();
  });

  // req: REQ-ROOM-002
  it("joins an existing room from a link and asks for a name", async () => {
    window.location.hash = "#/room/abc123";
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/your name/i), "Ana");
    await user.click(screen.getByRole("button", { name: /join room/i }));
    expect(window.location.hash).toBe("#/room/abc123");
    expect(screen.getByText(/Ana \(you\)/)).toBeInTheDocument();
  });

  // req: REQ-UI-002
  it("keeps Reveal primary and Reset a constant secondary button", async () => {
    const user = await startRoom();
    await user.click(screen.getByRole("button", { name: "5" }));
    const reveal = screen.getByRole("button", { name: "Reveal votes" });
    const reset = screen.getByRole("button", { name: "Reset" });
    expect(reveal).toHaveClass("btn--primary");
    expect(reset).toHaveClass("btn--secondary");
    expect(reset).toBeEnabled();
    await user.click(reveal);
    expect(reveal).toBeDisabled();
    expect(reset).toHaveClass("btn--secondary");
    expect(reset).toBeEnabled();
  });

  // req: REQ-UI-009
  it("lays out title, deck, actions, estimate and participants in that order", async () => {
    await startRoom();
    const order = [
      screen.getByRole("heading", { level: 1 }),
      screen.getByRole("group", { name: "Choose your card" }),
      screen.getByRole("button", { name: "Reveal votes" }),
      screen.getByRole("region", { name: "Estimate" }),
      screen.getByRole("list", { name: "Participants" }),
    ];
    for (let i = 1; i < order.length; i++) {
      expect(
        order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  // req: REQ-VOTE-004
  it("keeps the estimate row, empty until reveal, then the next Fibonacci number", async () => {
    const user = await startRoom();
    const row = screen.getByRole("region", { name: "Estimate" });
    expect(row).toHaveTextContent(/^Estimate$/);
    await user.click(screen.getByRole("button", { name: "42" }));
    expect(row).toHaveTextContent(/^Estimate$/);
    await user.click(screen.getByRole("button", { name: "Reveal votes" }));
    expect(row).toHaveTextContent(/^Estimate55$/);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("region", { name: "Estimate" })).toHaveTextContent(/^Estimate$/);
    expect(screen.queryByText(/talk it through|average|votes differ/i)).toBeNull();
  });

  // req: REQ-VOTE-001
  // req: REQ-UI-005
  it("marks the picked card for assistive tech and shows the value only after reveal", async () => {
    const user = await startRoom();
    const five = screen.getByRole("button", { name: "5" });
    await user.click(five);
    expect(five).toHaveAttribute("aria-pressed", "true");
    const people = screen.getByRole("list", { name: "Participants" });
    expect(within(people).getByText(/voted/i)).toBeInTheDocument();
    expect(within(people).queryByText("5")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Reveal votes" }));
    expect(within(people).getByText("5")).toBeInTheDocument();
  });

  // req: REQ-VOTE-005
  it("resets the room with cleared votes", async () => {
    const user = await startRoom();
    await user.click(screen.getByRole("button", { name: "8" }));
    await user.click(screen.getByRole("button", { name: "Reveal votes" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("heading", { name: /fibonacci/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "8" })).toHaveAttribute("aria-pressed", "false");
  });

  // req: REQ-UI-008
  it("uses friendly waiting copy", async () => {
    await startRoom();
    expect(screen.getByRole("status")).toHaveTextContent("Pick a card to get started.");
  });

  // req: REQ-LANG-001
  it("switches the language and remembers it", async () => {
    const user = userEvent.setup();
    localStorage.removeItem("fr.lang");
    const { unmount } = render(<App />);
    await user.selectOptions(screen.getByRole("combobox", { name: "Language" }), "de");
    expect(screen.getByLabelText("Dein Name")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("de");
    unmount();
    render(<App />);
    expect(screen.getByLabelText("Dein Name")).toBeInTheDocument();
    localStorage.removeItem("fr.lang");
  });

  // req: REQ-LANG-002
  it("uses the plural rules of the language", () => {
    expect(makeT("en")("room.waiting", { count: 1 })).toBe("Waiting for 1 more vote…");
    expect(makeT("en")("room.waiting", { count: 2 })).toBe("Waiting for 2 more votes…");
    expect(makeT("de")("room.waiting", { count: 1 })).toBe("Warte auf noch 1 Stimme…");
    expect(makeT("pl")("room.waiting", { count: 1 })).toContain("1 głos…");
    expect(makeT("pl")("room.waiting", { count: 3 })).toContain("3 głosy…");
    expect(makeT("pl")("room.waiting", { count: 5 })).toContain("5 głosów…");
    expect(makeT("ru")("room.waiting", { count: 1 })).toContain("1 голос…");
    expect(makeT("ru")("room.waiting", { count: 3 })).toContain("3 голоса…");
    expect(makeT("ru")("room.waiting", { count: 5 })).toContain("5 голосов…");
  });

  // req: REQ-ROOM-008
  it("copies the invite link, shows it for 2 s and offers it for manual copy", async () => {
    const user = await startRoom();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue({ writeText } as never);
    await user.click(screen.getByRole("button", { name: "Menu" }));
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.click(screen.getByRole("button", { name: "Copy invite link" }));
    expect(await screen.findByRole("button", { name: "Link copied" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2100);
    expect(await screen.findByRole("button", { name: "Copy invite link" })).toBeInTheDocument();
    vi.useRealTimers();
    await user.click(screen.getByRole("button", { name: "Show invite link" }));
    expect((screen.getByLabelText("Invite link") as HTMLInputElement).value).toContain("#/room/");
  });
});
