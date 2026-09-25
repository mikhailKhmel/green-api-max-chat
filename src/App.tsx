import { AppShell, Box, Stack, Text } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { greenApi } from "./api/greenApi";
import { Brand } from "./components/Brand";
import { ChatConversation } from "./components/ChatConversation";
import { ChatList } from "./components/ChatList";
import { ConnectionForm } from "./components/ConnectionForm";
import { NewChatForm } from "./components/NewChatForm";
import { Welcome } from "./components/Welcome";
import { useNotifications } from "./hooks/useNotifications";
import type { Chat, Credentials, Message, Notice } from "./types";
import { messageSchema } from "./validation";

const blankCredentials: Credentials = { idInstance: "", apiTokenInstance: "" };

export default function App() {
  const [credentials, setCredentials] = useState<Credentials>(blankCredentials);
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const normalizedCredentials = useMemo(
    () => ({
      idInstance: credentials.idInstance.trim(),
      apiTokenInstance: credentials.apiTokenInstance.trim(),
    }),
    [credentials],
  );

  const addMessage = useCallback(
    (message: Message) =>
      setMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message],
      ),
    [],
  );
  const showError = useCallback(
    (text: string) => setNotice({ kind: "error", text }),
    [],
  );
  useNotifications({
    credentials: normalizedCredentials,
    connected,
    chat,
    onMessage: addMessage,
    onError: showError,
  });

  const connect = (value: Credentials) => {
    setCredentials(value);
    setConnected(true);
    setNotice({
      kind: "success",
      text: "Инстанс подключён. Теперь создайте чат.",
    });
  };
  const disconnect = () => {
    setConnected(false);
    setChat(null);
    setMessages([]);
    setNotice(null);
  };
  const createChat = (phone: string) => {
    setChat({ id: phone, title: `+${phone}` });
    setMessages([]);
    setDraft("");
    setNotice(null);
  };
  const send = async () => {
    const parsed = messageSchema.safeParse(draft);
    if (!parsed.success) {
      showError(parsed.error.issues[0].message);
      return;
    }
    if (!chat || sending) return;
    setSending(true);
    setNotice(null);
    try {
      const response = await greenApi.sendMessage(
        normalizedCredentials,
        chat.id,
        parsed.data,
      );
      addMessage({
        id: response.idMessage || `local-${Date.now()}`,
        text: parsed.data,
        outgoing: true,
        timestamp: Math.floor(Date.now() / 1000),
      });
      setDraft("");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить сообщение.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell
      navbar={{ width: 360, breakpoint: "sm" }}
      padding={0}
      className="app-shell"
    >
      <AppShell.Navbar className="sidebar">
        <Stack h="100%" gap="md">
          <Brand />
          <ConnectionForm
            connected={connected}
            onConnect={connect}
            onDisconnect={disconnect}
          />
          <NewChatForm connected={connected} onCreate={createChat} />
          <ChatList chat={chat} onSelect={setChat} />
          <Text size="xs" c="dimmed" mt="auto">
            Сообщения передаются через GREEN-API
          </Text>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main className="chat-panel">
        {chat ? (
          <ChatConversation
            chat={chat}
            connected={connected}
            messages={messages}
            draft={draft}
            sending={sending}
            notice={notice}
            onDraftChange={setDraft}
            onSend={() => void send()}
            onCloseNotice={() => setNotice(null)}
          />
        ) : (
          <Welcome />
        )}
      </AppShell.Main>
    </AppShell>
  );
}
