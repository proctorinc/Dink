import { setupServer } from "msw/node";
import { rest } from "msw";
import superjson from "superjson";

export const SERVER_URL = `http://localhost:${
  process.env.PORT ?? 3000
}/api/trpc`;

const jsonSucessResponse = (data: unknown) => ({
  id: null,
  result: { type: "data", data: superjson.serialize(data) },
});

const handlers = [
  rest.get(`${SERVER_URL}/example.hello`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([jsonSucessResponse({ greeting: `Goodbye from TRPC` })])
    );
  }),
];

export const server = setupServer(...handlers);
