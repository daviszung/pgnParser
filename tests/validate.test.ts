import { expect, test, describe, beforeEach } from "bun:test";
import { validateFormat } from "../src/validateFormat";

const pgn1 = "1. e4 e5"
const pgn2 = "not a pgn"
const pgn3 = "2. e4 e5"
const dubovNepoDraw = "1. Nf3 Nf6 2. Nd4 Nd5 3. Nb3 Nb6 4. Nc3 Nc6 5. Ne4 Ne5 6. Ng5 Ng4 7. Nf3 Nf6 8. Ng1 Ng8 9. Nc5 Nc4 10. Na4 Na5 11. Nc3 Nc6 12. Nb1 Nb8 13. Nf3"

describe("PGN format validation works as expected", () => {

    test("PGN 1", () => {
        expect(validateFormat(pgn1)).toBe(true)
    })

    test("PGN 2", () => {
        expect(validateFormat(pgn2)).toBe(false)
    })

    test("PGN 3", () => {
        expect(validateFormat(pgn3)).toBe(false)
    })

    test("Dubov and Nepo Draw", () => {
        expect(validateFormat(dubovNepoDraw)).toBe(true)
    })
})