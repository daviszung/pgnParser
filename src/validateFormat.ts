
type formatOrder = "number" | "whiteMove" | "blackMove";

type Piece = "P" | "N" | "B" | "R" | "Q" | "K";
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export function validateFormat(pgn: string) {

    // separate the pgn into parts
    const parts = pgn.split(" ");

    // the format will expect a number, then white's move, then black's move, and then back to a number
    let order: formatOrder = "number";

    // track what set of moves we are on
    let count = 1;

    for (const i of parts) {
        switch (order) {
            case "number":

                if (i.length < 2 || i[i.length - 1] !== "." || Number(i.substring(0, i.length - 1)) !== count) {
                    return false;
                }

                count += 1;
                order = "whiteMove";
                break;

            case "whiteMove":

                const moveAnatomyWhite = disectMove(i, "w");

                if (!moveAnatomyWhite["valid"]) {
                    return false;
                }

                order = "blackMove";

                break;

            case "blackMove":

                const moveAnatomyBlack = disectMove(i, "b");

                if (!moveAnatomyBlack["valid"]) {
                    return false;
                }


                order = "number";

                break;
            default:
                break;
        }

    }


    return true;

}

export type MoveAnatomy = {
    color: "w" | "b";
    piece: Piece | null;
    pieceSpecifier: Rank | File | null;
    rank: Rank | null;
    file: File | null;
    captures: boolean;
    check: boolean;
    checkmate: boolean;
    special: false | "shortCastle" | "longCastle";
    valid: boolean;
};

const pieces: Piece[] = ["N", "B", "R", "Q", "K"] as const;
const files: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8] as const;




// I should try doing some process of elimination. First eliminate the special moves like castling
// I can then look for checks and captures. I can label it as a check or capture and then remove the x or + sign to make it easier to parse
// Then eliminate the pawn moves. These are strings of length 2 and they only have file and rank
// In the case that the move is a capture, a pawn move would turn out to be length 3 after removing the x (exf4) => (ef4)
// Maybe just deal with the case of captures first before parsing other things

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
    };

    // special move
    if (move === "O-O") {
        moveAnatomy["special"] = "shortCastle";
        moveAnatomy["valid"] = true;
        return moveAnatomy;
    } else if (move === "O-O-O") {
        moveAnatomy["special"] = "longCastle";
        moveAnatomy["valid"] = true;
        return moveAnatomy;
    }

    // checks and captures
    let x = 0;
    let check = 0;
    let mate = 0;
    for (let i = 0; i < move.length; i++) {
        if (move[i] === "x") {
            x += 1;
        } else if (move[i] === "+") {
            check += 1;
        } else if (move[i] === "#") {
            mate += 1;
        }
    }

    // moves cannot have more than one x or plus sign for a move
    if (x > 1 || check > 1 || mate > 1) {
        moveAnatomy["valid"] = false;
        return moveAnatomy;
    }

    // Qxf7+# are not correct notation, if it is checkmate you don't need to write the check
    if (mate === 1 && check === 1) {
        moveAnatomy["valid"] = false;
        return moveAnatomy;
    }

    // register moves with captures, check, or checkmate
    moveAnatomy["captures"] = (x === 1);
    moveAnatomy["check"] = (check === 1);
    moveAnatomy["checkmate"] = (mate === 1);

    // removing all "x", "+", and "#"
    let moveAsArray = move.split("");
    moveAsArray = moveAsArray.filter((char) => char !== "x" && char !== "+" && char !== "#");

    move = moveAsArray.join("");

    if (moveAnatomy["captures"]) {
        return handleCaptures(move, moveAnatomy);
    }

    // simple pawn moves
    if (move.length === 2) {

        for (const file of files) {
            if (move[0] === file) {
                moveAnatomy["file"] = file;
            }
        }

        if (Number(move[1]) >= 1 && Number(move[1]) <= 8) {
            moveAnatomy["rank"] = Number(move[1]) as Rank;
        }

        if (moveAnatomy["file"] && moveAnatomy["rank"]) {
            moveAnatomy["piece"] = "P";
            moveAnatomy["valid"] = true;
        }

        return moveAnatomy;

    }

    // Piece detection
    for (const piece of pieces) {
        if (move[0] === piece) {
            moveAnatomy["piece"] = piece;
        }
    }

    console.log(moveAnatomy["piece"], move);

    return moveAnatomy;

}


// expects moves like fe4 rather than fxe4 since the disection function will remove the x
export function handleCaptures(move: string, moveAnatomy: MoveAnatomy) {

    // only expecting moves of length 3 or 4
    if (move.length > 4 || move.length < 3) {
        return moveAnatomy;
    }

    // moves of length 4 must be checks or captures
    if (move.length === 4 && !(move[3] === "+" || move[3] === "#")) {
        return moveAnatomy;
    }

    const validFile = files.includes(move[1] as File);
    const validRank = Number(move[2]) >= 1 && Number(move[2]) <= 8;

    // standard capture move format
    moveAnatomy["file"] = move[1] as File;
    moveAnatomy["rank"] = Number(move[2]) as Rank;

    // Pawn move
    if (files.includes(move[0] as File)) {
        moveAnatomy["piece"] = "P";
    }

    // Piece move
    else if (pieces.includes(move[0] as Piece)) {
        moveAnatomy["piece"] = move[0] as Piece;
    }

    // to be a valid capture move, we must have found the file, rank, and piece in the right format
    if (validFile && validRank && moveAnatomy["piece"]) {
        moveAnatomy["valid"] = true;
    }

    return moveAnatomy;

}