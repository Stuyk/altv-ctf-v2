/**
 * Shuffle an array, and return randomized order.
 *
 *
 * @template T
 * @param {Array<T>} array
 * @return {Array<T>}
 */
export function shuffle<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length;
    let randomIndex: number;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

/**
 * Split an array in half.
 *
 * @export
 * @template T
 * @param {Array<T>} array
 * @return {[Array<T>, Array<T>]}
 */
export function split<T>(array: Array<T>): [Array<T>, Array<T>] {
    const half = Math.ceil(array.length / 2);
    return [array.slice(0, half), array.slice(half)];
}
