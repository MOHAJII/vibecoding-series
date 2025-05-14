/**
 * Insertion Sort implementation
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} - Sorted array in ascending order
 */
function insertionSort(arr) {
    // Make a copy of the input array to avoid modifying the original
    const array = [...arr];
    const length = array.length;

    // Start from the second element (index 1)
    // We assume the first element is already sorted
    for (let i = 1; i < length; i++) {
        // Store the current element that we want to insert into the sorted portion
        let currentElement = array[i];
        
        // Start comparing with previous elements
        let j = i - 1;
        
        // Move elements that are greater than currentElement
        // one position ahead to make space for currentElement
        while (j >= 0 && array[j] > currentElement) {
            array[j + 1] = array[j];  // Shift element to the right
            j--;
        }
        
        // Place currentElement in its correct position
        array[j + 1] = currentElement;
    }

    return array;
}

// Example usage:
// const numbers = [64, 34, 25, 12, 22, 11, 90];
// console.log(insertionSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]

export default insertionSort;
