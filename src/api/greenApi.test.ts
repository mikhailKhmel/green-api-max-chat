import { afterEach, describe, expect, it, vi } from "vitest";
import { greenApi } from "./greenApi";

const credentials = { idInstance: "123", apiTokenInstance: "secret" };
const mockResponse = (body: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  }) as unknown as Response;

afterEach(() => vi.unstubAllGlobals());

describe("greenApi", () => {
  it("sends text using the documented sendMessage endpoint", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockResponse({ idMessage: "message-id" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      greenApi.sendMessage(credentials, "79991234567", "Привет"),
    ).resolves.toEqual({
      idMessage: "message-id",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.green-api.com/waInstance123/sendMessage/secret",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ chatId: "79991234567", message: "Привет" }),
      }),
    );
  });

  it("returns null when no notification is available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({}, true, 204)),
    );

    await expect(greenApi.receiveNotification(credentials)).resolves.toBeNull();
  });

  it("throws API error messages", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          mockResponse({ message: "Invalid token" }, false, 401),
        ),
    );

    await expect(greenApi.deleteNotification(credentials, 1)).rejects.toThrow(
      "Invalid token",
    );
  });
});
