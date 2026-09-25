import type { ApiNotification, Credentials } from "../types";

const API_URL = "https://api.green-api.com";

const endpoint = (credentials: Credentials, method: string) =>
  `${API_URL}/waInstance${encodeURIComponent(credentials.idInstance)}/${method}/${encodeURIComponent(credentials.apiTokenInstance)}`;

const responseJson = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : `GREEN-API вернул код ${response.status}`;
    throw new Error(message);
  }
  return data as T;
};

export const greenApi = {
  async sendMessage(
    credentials: Credentials,
    chatId: string,
    message: string,
  ): Promise<{ idMessage?: string }> {
    const response = await fetch(endpoint(credentials, "sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message }),
    });
    return responseJson(response);
  },

  async receiveNotification(
    credentials: Credentials,
  ): Promise<ApiNotification | null> {
    const response = await fetch(
      `${endpoint(credentials, "receiveNotification")}?receiveTimeout=5`,
    );
    if (response.status === 204) return null;
    return responseJson<ApiNotification>(response);
  },

  async deleteNotification(
    credentials: Credentials,
    receiptId: number,
  ): Promise<void> {
    const response = await fetch(
      `${endpoint(credentials, "deleteNotification")}/${encodeURIComponent(receiptId)}`,
      { method: "DELETE" },
    );
    await responseJson(response);
  },
};
