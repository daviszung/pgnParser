
type formatOrder = "number" | "whiteMove" | "blackMove"

type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"

export function validateFormat(pgn: string) {

    // separate the pgn into parts
    const parts = pgn.split(" ");

    // the format will expect a number, then white's move, then black's move, and then back to a number
    let order: formatOrder = "number"

    // track what set of moves we are on
    let count = 1

    for (const i of parts) {
        switch (order) {
            case "number":

                if (i.length < 2 || i[i.length - 1] !== "." || Number(i.substring(0, i.length - 1)) !== count) {
                    return false
                }

                count += 1
                order = "whiteMove"
                break;
        
            case "whiteMove":

                disectMove(i, "w")

                order = "blackMove"

                break;

            case "blackMove":

                disectMove(i, "b")

                order = "number"

                break;
            default:
                break;
        }
        
    }


    return true;

}

type MoveAnatomy = {
    color: "w" | "b"
    piece: "P" | "N" | "B" | "R" | "Q" | "K" | null
    pieceSpecifier: Rank | File | null
    rank: Rank | null 
    file: File | null
    captures: boolean
    check: boolean
    checkmate: boolean
    special: false | "shortCastle" | "longCastle"
    valid: boolean
}

const pieces = ["N", "B", "R", "Q", "K"]

function disectMove(move: string, color: "w" | "b") {

    const moveAnatomy: MoveAnatomy = {
        color: color,
        piece: null, 
        pieceSpecifier: null,
        rank: null,
        file: null,
        captures: false,
        check: false,
        checkmate: false,
        special: false,
        valid: false,
    }

    // special move
    if (move === "O-O") {
        moveAnatomy["special"] = "shortCastle"
        moveAnatomy["valid"] = true
        return moveAnatomy
    } else if (move === "O-O-O") {
        moveAnatomy["special"] = "longCastle"
        moveAnatomy["valid"] = true
        return moveAnatomy
    }

    for (let i = 0; i < move.length; i++) {

    }

    return moveAnatomy

}