
type formatOrder = "number" | "whiteMove" | "blackMove"

type Piece = "P" | "N" | "B" | "R" | "Q" | "K" 
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

                const moveAnatomyWhite = disectMove(i, "w")

                if (!moveAnatomyWhite["valid"]) {
                    return false
                }

                order = "blackMove"

                break;

            case "blackMove":

                const moveAnatomyBlack = disectMove(i, "b")

                if (!moveAnatomyBlack["valid"]) {
                    return false
                }


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
    piece: Piece | null
    pieceSpecifier: Rank | File | null
    rank: Rank | null 
    file: File | null
    captures: boolean
    check: boolean
    checkmate: boolean
    special: false | "shortCastle" | "longCastle"
    valid: boolean
}

const pieces: Piece[] = ["N", "B", "R", "Q", "K"] as const
const files: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"] as const
const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8] as const




// I should try doing some process of elimination. First eliminate the special moves like castling
// Then eliminate the pawn moves with no captures. These are strings of length 2 and they only have file and rank

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

    // simple pawn moves
    if (move.length === 2) {

        for (const file of files) {
            if (move[0] === file) {
                moveAnatomy["file"] = file;
            }
        }

        if (Number(move[1]) >= 1 && Number(move[1]) <= 8 ) {
            moveAnatomy["rank"] = Number(move[1]) as Rank;
        }

        if (moveAnatomy["file"] && moveAnatomy["rank"]) {
            moveAnatomy["piece"] = "P";
            moveAnatomy["valid"] = true
        }

        console.log(move, moveAnatomy);

        return moveAnatomy

    }

    // Piece detection
    for (const piece of pieces) {
        if (move[0] === piece) {
            moveAnatomy["piece"] = piece;
        }
    }

    return moveAnatomy;

}