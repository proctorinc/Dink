import Test from "~/pages/sample";
import { render, screen } from "~/test-utils";

describe("Test Page", () => {
  it("Should render text from the api", async () => {
    render(<Test />);

    const text = await screen.findByText("Goodbye from TRPC");

    expect(text).toBeInTheDocument();
  });
});
