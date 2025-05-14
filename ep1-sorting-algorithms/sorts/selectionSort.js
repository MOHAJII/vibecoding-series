/**
 * Selection Sort implementation
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} - Sorted array in ascending order
 */
function selectionSort(arr) {
    // Make a copy of the input array to avoid modifying the original
    const array = [...arr];
    const length = array.length;

    // Outer loop - moves the boundary of unsorted portion
    for (let i = 0; i < length - 1; i++) {
        // Assume the current index has the minimum value
        let minIndex = i;

        // Inner loop - find the minimum element in unsorted portion
        for (let j = i + 1; j < length; j++) {
            // If we find a smaller element, update minIndex
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        // If minIndex changed, swap elements
        if (minIndex !== i) {
            // Swap the found minimum element with the first element of unsorted portion
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }

    return array;
}

// Example usage:
// const numbers = [64, 34, 25, 12, 22, 11, 90];
// console.log(selectionSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]

export default selectionSort;
