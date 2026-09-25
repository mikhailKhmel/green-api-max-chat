import { describe, expect, it } from "vitest";
import {
  credentialsSchema,
  messageSchema,
  normalizePhone,
  phoneSchema,
} from "./validation";

describe("validation schemas", () => {
  it("accepts valid GREEN-API credentials", () => {
    expect(
      credentialsSchema.safeParse({
        idInstance: "1234567890",
        apiTokenInstance: "token",
      }).success,
    ).toBe(true);
  });

  it("rejects non-numeric instance ids and empty tokens", () => {
    const result = credentialsSchema.safeParse({
      idInstance: "instance",
      apiTokenInstance: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "idInstance должен содержать только цифры.",
        "Введите apiTokenInstance.",
      ]);
    }
  });

  it("normalizes and validates recipient numbers", () => {
    expect(normalizePhone("+7 (999) 123-45-67")).toBe("79991234567");
    expect(phoneSchema.safeParse("+7 (999) 123-45-67").success).toBe(true);
    expect(phoneSchema.safeParse("123").success).toBe(false);
  });

  it("accepts text messages up to 4000 characters", () => {
    expect(messageSchema.safeParse("Сообщение").success).toBe(true);
    expect(messageSchema.safeParse("").success).toBe(false);
    expect(messageSchema.safeParse("x".repeat(4001)).success).toBe(false);
  });
});
