import { Elysia, t } from "elysia";
import { Board } from "./board";
import { file } from "bun";

const app = new Elysia()

.get("/", () => "Hello Elysia")
.get("/pgn", async () => {

  let myFile = file("./pgns/lichessRosen.pgn")
  const b = await myFile.text()

  
  console.log(b);

})
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
