import LoginPage from "~/pages/auth/login/index";
import { render, screen, userEvent, withNoAuth } from "~/test-utils";
import { useRouter } from "next/router";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

const mockOn = jest.fn();

describe("Login Page", () => {
  it("Renders login page properly", async () => {
    render(<LoginPage />);
    const loginButton = await screen.findByRole("button", {
      name: /login with google/i,
    });

    expect(loginButton).toBeInTheDocument();
  });

  it("Navigates to google login page on click", async () => {
    render(<LoginPage />);
    // useRouter.mockReturnValue({
    //   events: {
    //     on: mockOn,
    //     off: () => {},
    //   },
    // });
    const loginButton = await screen.findByRole("button", {
      name: /login with google/i,
    });

    await userEvent.click(loginButton);

    expect(mockOn).toHaveBeenCalledWith("hellooooo");
  });
});
