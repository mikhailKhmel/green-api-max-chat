import { Button, Paper, Stack, Text, TextInput } from "@mantine/core";
import { IconPhone, IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { newChatSchema, normalizePhone } from "../validation";

type Props = { connected: boolean; onCreate: (phone: string) => void };

export function NewChatForm({ connected, onCreate }: Props) {
  const form = useForm({
    initialValues: { phone: "" },
    validate: (values) => {
      const result = newChatSchema.safeParse(values);
      if (result.success) return {};
      return Object.fromEntries(
        result.error.issues.map((issue) => [
          String(issue.path[0]),
          issue.message,
        ]),
      );
    },
  });
  const submit = ({ phone }: { phone: string }) => {
    onCreate(normalizePhone(phone));
    form.setFieldValue("phone", "");
  };
  return (
    <Paper withBorder radius="lg" p="md" className="new-chat">
      <Text className="section-label">Новый чат</Text>
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="sm">
          <TextInput
            label="Номер получателя"
            placeholder="79991234567"
            leftSection={<IconPhone size={16} />}
            inputMode="tel"
            disabled={!connected}
            {...form.getInputProps("phone")}
          />
          <Button
            type="submit"
            rightSection={<IconPlus size={16} />}
            disabled={!connected}
          >
            Создать чат
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
