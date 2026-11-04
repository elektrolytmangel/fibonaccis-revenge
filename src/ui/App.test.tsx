import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  it("offers one primary action per state", async () => {
    const user = await startRoom();
    await user.click(screen.getByRole("button", { name: "5" }));
    expect(screen.getByRole("button", { name: "Reveal votes" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Reveal votes" }));
    expect(screen.queryByRole("button", { name: "Reveal votes" })).toBeNull();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  // req: REQ-VOTE-001
  // req: REQ-UI-005
  it("marks the picked card without colour alone and shows the value only after reveal", async () => {
    const user = await startRoom();
    const five = screen.getByRole("button", { name: "5" });
    await user.click(five);
    expect(five).toHaveAttribute("aria-pressed", "true");
    expect(within(five).getByText(/your pick/i)).toBeInTheDocument();
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
});
