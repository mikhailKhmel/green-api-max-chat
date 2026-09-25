import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowUp,
  IconInfoCircle,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import type { Chat, Message, Notice } from "../types";

type Props = {
  chat: Chat;
  connected: boolean;
  messages: Message[];
  draft: string;
  sending: boolean;
  notice: Notice | null;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onCloseNotice: () => void;
};

export function ChatConversation({
  chat,
  connected,
  messages,
  draft,
  sending,
  notice,
  onDraftChange,
  onSend,
  onCloseNotice,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Stack gap={0} h="100%" className="conversation">
      {notice && (
        <Alert
          className="notice"
          color={notice.kind === "error" ? "red" : "green"}
          withCloseButton
          closeButtonLabel="Закрыть"
          onClose={onCloseNotice}
        >
          {notice.text}
        </Alert>
      )}
      <Group className="chat-header" justify="space-between">
        <Group gap="sm">
          <Avatar color="violet" radius="xl" size="lg">
            {chat.title[0]}
          </Avatar>
          <Box>
            <Text fw={600}>{chat.title}</Text>
            <Text size="xs" c={connected ? "teal" : "dimmed"}>
              {connected ? "в сети через GREEN-API" : "нет подключения"}
            </Text>
          </Box>
        </Group>
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label="Информация о чате"
        >
          <IconInfoCircle size={21} />
        </ActionIcon>
      </Group>
      <Stack className="messages" gap={4}>
        <Text className="date-label">Сегодня</Text>
        {messages.length === 0 && (
          <Center className="empty-chat">
            <Stack align="center" gap={6}>
              <ThemeIcon size={44} radius="md" variant="light">
                <IconMessageCircle size={24} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                Начните разговор
              </Text>
              <Text c="dimmed" size="xs">
                Отправьте первое текстовое сообщение в MAX
              </Text>
            </Stack>
          </Center>
        )}
        {messages.map((message) => (
          <Paper
            key={message.id}
            className={`message ${message.outgoing ? "message--outgoing" : "message--incoming"}`}
            radius="md"
            p="sm"
          >
            <Text size="sm" className="message-text">
              {message.text}
            </Text>
            <Text c="dimmed" size="xs" ta="right" mt={4}>
              {new Date(message.timestamp * 1000).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {message.outgoing && "  ✓✓"}
            </Text>
          </Paper>
        ))}
        <div ref={endRef} />
      </Stack>
      <Paper withBorder radius="lg" p={6} className="composer">
        <Group align="flex-end" gap="sm">
          <Textarea
            value={draft}
            onChange={(event) => onDraftChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            placeholder="Напишите сообщение…"
            maxLength={4000}
            autosize
            minRows={1}
            maxRows={5}
            variant="unstyled"
            className="composer-input"
            aria-label="Текст сообщения"
          />
          <ActionIcon
            size={36}
            radius="md"
            variant="filled"
            loading={sending}
            disabled={!draft.trim()}
            onClick={onSend}
            aria-label="Отправить сообщение"
          >
            <IconArrowUp size={20} />
          </ActionIcon>
        </Group>
      </Paper>
    </Stack>
  );
}
