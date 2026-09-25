export type Credentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type Chat = {
  id: string;
  title: string;
};

export type Message = {
  id: string;
  text: string;
  outgoing: boolean;
  timestamp: number;
};

export type Notice = {
  kind: "success" | "error";
  text: string;
};

export type ApiNotification = {
  receiptId?: number;
  body?: {
    typeWebhook?: string;
    idMessage?: string;
    timestamp?: number;
    chatId?: string;
    senderData?: { chatId?: string };
    messageData?: {
      textMessage?: string;
      textMessageData?: { textMessage?: string };
      extendedTextMessageData?: { text?: string };
    };
  };
};
