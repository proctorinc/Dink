import { describe, it, vi } from "vitest";
import { screen, render, userEvent } from "@/testUtils.jsx";
import BudgetEntry from "../BudgetEntry";

const mockBudget = {
  _id: "mock-budget-id",
  name: "Mock Budget",
  goal: 200,
  currentAmount: 75.34,
};

const mockedNavigator = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockedNavigator,
}));

describe("Budget Entry", () => {
  it("renders properly", () => {
    render(<BudgetEntry budget={mockBudget} />);

    const name = screen.getByRole("heading", {
      name: mockBudget.name,
    });
    const usageStatus = screen.getByText("$75.34 of $200.00");
    const leftover = screen.getByText("$124.66 left");
    const barChart = screen.getByTestId("budget-bar-chart");

    expect(name).toBeInTheDocument();
    expect(usageStatus).toBeInTheDocument();
    expect(leftover).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
  });

  it("forwards to budget page on click", async () => {
    const user = userEvent.setup();
    render(<BudgetEntry budget={mockBudget} />);

    const name = screen.getByRole("heading", {
      name: mockBudget.name,
    });

    await user.click(name);

    expect(mockedNavigator).toHaveBeenCalledWith("/budgets/mock-budget-id");
  });
});
