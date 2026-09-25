import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import type { Chat } from "../types";

type Props = { chat: Chat | null; onSelect: (chat: Chat) => void };

export function ChatList({ chat, onSelect }: Props) {
  if (!chat)
    return (
      <Text c="dimmed" size="xs" ta="center" mt="xl">
        Созданные чаты появятся здесь
      </Text>
    );
  return (
    <Button
      variant="light"
      color="violet"
      fullWidth
      justify="flex-start"
      h="auto"
      p="sm"
      onClick={() => onSelect(chat)}
    >
      <Group gap="sm">
        <Avatar color="violet" radius="xl">
          {chat.title[0]}
        </Avatar>
        <Stack gap={1} align="flex-start">
          <Text size="sm" fw={600}>
            {chat.title}
          </Text>
          <Text size="xs" c="dimmed">
            Чат MAX
          </Text>
        </Stack>
      </Group>
    </Button>
  );
}
