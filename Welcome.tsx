import { Stack, Text, ThemeIcon } from "@mantine/core";

export function Welcome() {
  return (
    <Stack className="welcome" align="center" justify="center" gap="md">
      <ThemeIcon className="welcome-mark" size={66} radius={22}>
        m
      </ThemeIcon>
      <Text className="welcome-title" fw={700}>
        Ваши сообщения —<br />в одном месте
      </Text>
      <Text c="dimmed" maw={380} ta="center">
        Подключите инстанс GREEN-API и создайте чат по номеру получателя, чтобы
        отправлять и получать текстовые сообщения в MAX.
      </Text>
    </Stack>
  );
}
