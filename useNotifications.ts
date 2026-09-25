import { useEffect } from "react";
import { greenApi } from "../api/greenApi";
import type { Chat, Credentials, Message } from "../types";

const getText = (
  notification: NonNullable<
    Awaited<ReturnType<typeof greenApi.receiveNotification>>
  >["body"],
) => {
  const data = notification?.messageData;
  return (
    data?.textMessageData?.textMessage ||
    data?.extendedTextMessageData?.text ||
    data?.textMessage ||
    ""
  );
};

type UseNotificationsOptions = {
  credentials: Credentials;
  connected: boolean;
  chat: Chat | null;
  onMessage: (message: Message) => void;
  onError: (message: string) => void;
};

export function useNotifications({
  credentials,
  connected,
  chat,
  onMessage,
  onError,
}: UseNotificationsOptions) {
  useEffect(() => {
    if (!connected) return undefined;

    let cancelled = false;
    let timeoutId: number | undefined;

    const receive = async () => {
      try {
        const notification = await greenApi.receiveNotification(credentials);
        if (!notification || cancelled) return;

        const body = notification.body;
        const text = getText(body);
        const senderChatId = body?.senderData?.chatId || body?.chatId;
        if (
          body?.typeWebhook === "incomingMessageReceived" &&
          text &&
          chat?.id === senderChatId
        ) {
          onMessage({
            id:
              body.idMessage ||
              `${notification.receiptId}-${body.timestamp || Date.now()}`,
            text,
            outgoing: false,
            timestamp: body.timestamp || Math.floor(Date.now() / 1000),
          });
        }

        if (notification.receiptId !== undefined)
          await greenApi.deleteNotification(
            credentials,
            notification.receiptId,
          );
      } catch (error) {
        if (!cancelled)
          onError(
            error instanceof Error
              ? error.message
              : "Не удалось получить сообщения.",
          );
      } finally {
        if (!cancelled) timeoutId = window.setTimeout(receive, 300);
      }
    };

    void receive();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [chat?.id, connected, credentials, onError, onMessage]);
}
