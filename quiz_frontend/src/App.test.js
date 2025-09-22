import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Home hero content", () => {
  render(<App />);
  const title = screen.getByText(/Real-time Live Quiz/i);
  expect(title).toBeInTheDocument();
});
