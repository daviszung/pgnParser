import { expect, test, describe } from "bun:test";
import { validateFormat } from "../src/validateFormat";

const pgn1 = "1. e4 e5"
const pgn2 = "not a pgn"
const pgn3 = "2. e4 e5"
const pgn4 = "1. e4 e5 6. d4 exd4"
const pgn5 = "true. e4 e5"
const pgn6 = "1. 2. 3. 4. 5." 
const dubovNepoDraw = "1. Nf3 Nf6 2. Nd4 Nd5 3. Nb3 Nb6 4. Nc3 Nc6 5. Ne4 Ne5 6. Ng5 Ng4 7. Nf3 Nf6 8. Ng1 Ng8 9. Nc5 Nc4 10. Na4 Na5 11. Nc3 Nc6 12. Nb1 Nb8 13. Nf3"
const morphyBornemann = "1. e4 e5 2. f4 Bc5 3. Nf3 d6 4. c3 Bg4 5. Bc4 Nf6 6. fxe5 Bxf3 7. Qxf3 dxe5 8. d3 Nc6 9. Bg5 a6 10. Nd2 Be7 11. O-O-O Qd7 12. Nf1 O-O-O 13. Ne3 h6 14. Bh4 g5 15. Bg3 Rdf8 16. Nd5 Ne8 17. d4 exd4 18. cxd4 Bd8 19. Rhf1 Nd6 20. Bb3 Nb5 21. Qe3 f5 22. exf5 Rxf5 23. Nb6+ cxb6 24. Be6 Rd5 25. Rf7 Ne7 26. Kb1 Re8 27. Rc1+ Nc7 28. Bxd7+ Rxd7 29. d5 Nc6 30. dxc6 Rxe3 31. cxd7+ Kb8 32. Rxc7 1-0"

describe("PGN format validation works as expected", () => {

    test("Valid PGNs", () => {
        expect(validateFormat(pgn1)).toBe(true)
        expect(validateFormat(dubovNepoDraw)).toBe(true)
    })

    test("Invalid PGNs", () => {
        expect(validateFormat(pgn2)).toBe(false)
        expect(validateFormat(pgn3)).toBe(false)
        expect(validateFormat(pgn4)).toBe(false)
        expect(validateFormat(pgn5)).toBe(false)
        expect(validateFormat(pgn6)).toBe(false)
    })

})