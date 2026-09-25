import { z } from "zod";

export const credentialsSchema = z.object({
  idInstance: z
    .string()
    .trim()
    .regex(/^\d+$/, "idInstance должен содержать только цифры."),
  apiTokenInstance: z.string().trim().min(1, "Введите apiTokenInstance."),
});

export const phoneSchema = z.string().refine((value) => {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}, "Введите номер получателя в международном формате.");

export const normalizePhone = (value: string) => value.replace(/[^\d]/g, "");

export const newChatSchema = z.object({ phone: phoneSchema });

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Введите текст сообщения.")
  .max(4000, "Текст сообщения не должен превышать 4000 символов.");
