import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconKey, IconNumber } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { credentialsSchema } from "../validation";
import type { Credentials } from "../types";

type Props = {
  connected: boolean;
  onConnect: (credentials: Credentials) => void;
  onDisconnect: () => void;
};

export function ConnectionForm({ connected, onConnect, onDisconnect }: Props) {
  const form = useForm<Credentials>({
    initialValues: { idInstance: "", apiTokenInstance: "" },
    validate: (values) => {
      const result = credentialsSchema.safeParse(values);
      if (result.success) return {};
      return Object.fromEntries(
        result.error.issues.map((issue) => [
          String(issue.path[0]),
          issue.message,
        ]),
      );
    },
  });
  return (
    <Paper withBorder radius="lg" p="md" className="settings-card">
      <Text className="section-label">
        GREEN-API{" "}
        <span
          className={connected ? "status-dot status-dot--active" : "status-dot"}
        />
      </Text>
      <form onSubmit={form.onSubmit(onConnect)}>
        <Stack gap="sm">
          <TextInput
            label="idInstance"
            placeholder="Введите idInstance"
            leftSection={<IconNumber size={16} />}
            inputMode="numeric"
            disabled={connected}
            {...form.getInputProps("idInstance")}
          />
          <PasswordInput
            label="apiTokenInstance"
            placeholder="Введите apiTokenInstance"
            leftSection={<IconKey size={16} />}
            disabled={connected}
            {...form.getInputProps("apiTokenInstance")}
          />
          {connected ? (
            <Button variant="light" onClick={onDisconnect}>
              Изменить данные
            </Button>
          ) : (
            <Button type="submit">Подключить</Button>
          )}
        </Stack>
      </form>
    </Paper>
  );
}
