import { describe, it, vi } from "vitest";
import { screen, render } from "@/testUtils.jsx";
import { mockBudgets } from "@/__mocks__/mock_features/budgets";
import BudgetList from "../BudgetList";

describe("Budget List", () => {
  it("renders correctly", () => {
    render(<BudgetList budgets={mockBudgets} isLoading={false} error={null} />);

    const budgetEntries = screen.getAllByRole("listitem");

    expect(budgetEntries).toHaveLength(mockBudgets.length);
    budgetEntries.forEach((entry, i) => {
      expect(entry).toHaveTextContent(mockBudgets[i].name);
    });
  });
});
