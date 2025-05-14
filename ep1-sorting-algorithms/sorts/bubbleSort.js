/**
 * Bubble Sort implementation
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} - Sorted array in ascending order
 */
function bubbleSort(arr) {
    // Make a copy of the input array to avoid modifying the original
    const array = [...arr];
    const length = array.length;
    
    // Outer loop - each pass through the array
    for (let i = 0; i < length - 1; i++) {
        // Inner loop - compare adjacent elements
        for (let j = 0; j < length - 1 - i; j++) {
            // If current element is greater than next element, swap them
            if (array[j] > array[j + 1]) {
                // Swap using destructuring assignment
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    }
    
    return array;
}

// Example usage:
// const numbers = [64, 34, 25, 12, 22, 11, 90];
// console.log(bubbleSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]

export default bubbleSort;
