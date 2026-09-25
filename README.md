# MAX chat with GREEN-API

TypeScript React interface for sending and receiving text messages in MAX through GREEN-API. The interface uses Mantine components, while Zod validates credentials, phone numbers, and outgoing messages.

## Local launch

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open the address shown by Vite.

Run `npm run typecheck` to check TypeScript types, `npm run build` to create a production build, and `npm test` to run the unit tests.

## Usage

1. Enter `idInstance` and `apiTokenInstance` from your GREEN-API instance.
2. Click **Подключить**.
3. Enter the recipient's phone number in international format and create a chat.
4. Send a text message. Incoming text messages from that chat appear automatically.

The app calls `sendMessage`, then long-polls `receiveNotification` and confirms processed queue items with `deleteNotification`, as required by the GREEN-API HTTP API.

## Project structure

- `src/api` — typed GREEN-API client
- `src/components` — independent UI components based on Mantine
- `src/hooks` — long-polling of incoming notifications
- `src/validation.ts` — Zod schemas and normalizers
- `src/types.ts` — shared application types

For receiving messages, configure the instance in the GREEN-API console with an empty `webhookUrl` and incoming-message notifications enabled.
