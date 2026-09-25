import { Group, Text } from "@mantine/core";

export function Brand() {
  return (
    <Group gap={8} className="brand">
      <span className="brand-mark">m</span>
      <Text fw={700}>max</Text>
    </Group>
  );
}
