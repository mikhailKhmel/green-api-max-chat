import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useNotifications", () => ({ useNotifications: vi.fn() }));
vi.mock("./components/ChatConversation", () => ({
  ChatConversation: ({ chat }: { chat: { title: string } }) => (
    <div>{chat.title}</div>
  ),
}));

const renderApp = () =>
  render(
    <MantineProvider>
      <App />
    </MantineProvider>,
  );

describe("App", () => {
  it("shows Zod errors for missing credentials", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Подключить" }));

    expect(
      await screen.findByText("idInstance должен содержать только цифры."),
    ).toBeInTheDocument();
    expect(screen.getByText("Введите apiTokenInstance.")).toBeInTheDocument();
  });

  it("enables chat creation and normalizes the recipient number after connecting", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText("idInstance"), "1234567890");
    await user.type(screen.getByLabelText("apiTokenInstance"), "test-token");
    await user.click(screen.getByRole("button", { name: "Подключить" }));

    const phoneInput = screen.getByLabelText("Номер получателя");
    expect(phoneInput).toBeEnabled();
    await user.type(phoneInput, "+7 999 123-45-67");
    await user.click(screen.getByRole("button", { name: "Создать чат" }));

    expect(screen.getAllByText("+79991234567")).not.toHaveLength(0);
  });
});
