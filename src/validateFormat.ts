
type formatOrder = "number" | "whiteMove" | "blackMove"

export function validateFormat(pgn: string) {

    // the format will expect a number, then a move, then a move, and then back to a number

    let order: formatOrder = "number"

    let count = 1

    const parts = pgn.split(" ");

    for (const i of parts) {
        switch (order) {
            case "number":
                if (i.length < 2 || i[i.length - 1] !== "." || Number(i[0]) !== count) {
                    console.log(i);
                    return false
                }

                count += 1
                order = "whiteMove"
                break;
        
            case "whiteMove":

                order = "blackMove"

                break;

            case "blackMove":

                order = "number"

                break;
            default:
                break;
        }
        
    }


    return true;

}