import { render, screen } from "@testing-library/react";
import { App } from "./App";

// req: REQ-PLAT-001
it("renders the app shell", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /fibonacci/i })).toBeInTheDocument();
});
