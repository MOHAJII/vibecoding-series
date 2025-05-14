import bubbleSort from './sorts/bubbleSort.js';
import insertionSort from './sorts/insertionSort.js';
import selectionSort from './sorts/selectionSort.js';

// Helper function to generate test arrays
function generateArrays(size) {
    // Random array
    const random = Array.from({length: size}, () => Math.floor(Math.random() * 1000));
    
    // Sorted array
    const sorted = [...random].sort((a,b) => a - b);
    
    // Reverse sorted array
    const reverseSorted = [...sorted].reverse();
    
    return {
        random,
        sorted, 
        reverseSorted,
        empty: []
    };
}

// Function to test sorting algorithm performance
function testSort(algorithm, array) {
    const start = performance.now();
    algorithm(array);
    const end = performance.now();
    return end - start;
}

// Main testing function
function runSortingTests() {
    const sizes = [10, 100, 1000];
    const algorithms = [
        { name: 'Bubble Sort', fn: bubbleSort },
        { name: 'Insertion Sort', fn: insertionSort },
        { name: 'Selection Sort', fn: selectionSort }
    ];
    
    const results = [];

    // Test each size
    sizes.forEach(size => {
        const testArrays = generateArrays(size);
        
        // Test each algorithm
        algorithms.forEach(algo => {
            // Test each case
            Object.entries(testArrays).forEach(([caseName, array]) => {
                const time = testSort(algo.fn, array);
                
                results.push({
                    algorithm: algo.name,
                    case: caseName.charAt(0).toUpperCase() + caseName.slice(1),
                    size: size,
                    time: Number(time.toFixed(3))
                });
            });
        });
    });

    // Expose results globally
    window.sortResults = results;
    return results;
}

// Run tests when script loads
runSortingTests();


