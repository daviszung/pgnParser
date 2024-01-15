import { validateFormat } from "./validateFormat"

export class Board {

    turn: "w" | "b"
    board: Array<string[]> 

    constructor () {
        this.turn = "w"
        this.board = [
            ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
            ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
            ["E", "E", "E", "E", "E", "E", "E", "E"],
            ["E", "E", "E", "E", "E", "E", "E", "E"],
            ["E", "E", "E", "E", "E", "E", "E", "E"],
            ["E", "E", "E", "E", "E", "E", "E", "E"],
            ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
            ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
        ]

    }

    public validate(pgn: string) {

        if (!validateFormat(pgn)) {
            return false
        }
        

        return true

    }

    private makeMove(piece: string, file: number, rank: number, special?: "check" | "checkmate" | "captures") {


    }

}