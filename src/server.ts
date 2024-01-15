import { Elysia, t } from "elysia";
import { Board } from "./board";

const app = new Elysia()

.get("/", () => "Hello Elysia")
.post("/validate", ({ body }) => {
  const pgn = body.pgn
  const board = new Board()

  return board.validate(pgn)

}, {
  body: t.Object({
    pgn: t.String()
  })
})

.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
