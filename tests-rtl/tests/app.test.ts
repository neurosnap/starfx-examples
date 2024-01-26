import { render, screen, fireEvent, waitFor } from "./utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { App } from "../src/App";
import { fetchUsers } from "../src/api";

test("fetches users", async () => {
  fetchUsers.use(function* (ctx, next) {
    ctx.response = new Response(
      JSON.stringify([
        {
          id: 1,
          name: "Leanne Graham",
        },
        {
          id: 2,
          name: "Ervin Howell",
        },
      ])
    );
    yield* next();
  });

  render(<App id="1" />);
  expect(screen.getByRole("heading")).toHaveTextContent("hi there");

  const btn = await screen.findByRole("button", { name: /Fetch users/ });
  fireEvent.click(btn);

  await waitFor(
    () => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
  await waitFor(
    () => {
      expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
});
