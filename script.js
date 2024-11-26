const proxyUrl = 'https://corsproxy.io/?';
const quotesApi = 'https://loripsum.net/api/1/short/plaintext'; 

let timer = 60;
let mistakes = 0;
let quoteText = "";
let interval;

const timerDisplay = document.getElementById("timer");
const mistakesDisplay = document.getElementById("mistakes");
const quoteDisplay = document.getElementById("quote");
const quoteInput = document.getElementById("quote-input");
const accuracyDisplay = document.getElementById("accuracy");
const wpmDisplay = document.getElementById("wpm");
const resultContainer = document.querySelector('.result');
const nextButton = document.getElementById('stop-test'); // Get the "Next" button

async function fetchQuote() {
    try {
        quoteDisplay.textContent = 'Loading...';
        const response = await fetch(proxyUrl + quotesApi);
        const data = await response.text();

        if (!data.trim()) {
            throw new Error("Empty quote fetched");
        }

        // Generate the quote text
        quoteText = data.trim().split(" ").slice(0, 50).join(" "); // Limit to 50 words
        quoteDisplay.textContent = quoteText;
        startTimer();
    } catch (error) {
        console.error('Error fetching quotes:', error);
        quoteDisplay.textContent = 'Sorry, something went wrong. Please try again.';
    }
}

function startTest() {
    mistakes = 0; // Reset mistakes
    timer = 60; // Reset timer
    timerDisplay.textContent = `${timer}s`;
    mistakesDisplay.textContent = "0";
    quoteInput.disabled = false;
    quoteInput.value = ""; // Clear input field
    fetchQuote(); // Fetch a new quote
    resultContainer.style.display = 'none';
    nextButton.style.display = 'none'; // Hide the "Next" button
    quoteInput.focus();
}

function startTimer() {
    clearInterval(interval); // Clear any existing intervals
    interval = setInterval(updateTimer, 1000); // Start the timer
}

function stopTest() {
    clearInterval(interval); // Stop the timer
    quoteInput.disabled = true;
    displayResult();
}

function updateTimer() {
    if (timer > 0) {
        timer--;
        timerDisplay.textContent = `${timer}s`;
    } else {
        stopTest();
    }
}

function calculateAccuracy() {
    const correctChars = quoteText.length - mistakes; // Calculate correct characters
    const accuracy = (correctChars / quoteText.length) * 100; // Calculate percentage
    return accuracy.toFixed(2);
}

function calculateWPM() {
    const wordsTyped = quoteInput.value.trim().split(' ').length;
    const minutes = 1; // Total test duration in minutes
    const wpm = (wordsTyped / minutes).toFixed(2);
    return wpm;
}

function displayResult() {
    const accuracy = calculateAccuracy();
    const wpm = calculateWPM();
    accuracyDisplay.textContent = `${accuracy}%`;
    wpmDisplay.textContent = `${wpm}`;
    mistakesDisplay.textContent = `${mistakes}`;
    resultContainer.style.display = 'block'; // Show results
    nextButton.style.display = 'block'; // Show the "Next" button
}

function checkCompletion() {
    const typedText = quoteInput.value;
    let incorrectChars = 0;

    // Compare user input with quote text character by character
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== quoteText[i]) {
            incorrectChars++;
        }
    }

    mistakes = incorrectChars; // Update global mistakes count
    mistakesDisplay.textContent = `${mistakes}`; // Update UI

    // Update input field color
    const quoteSubstring = quoteText.substring(0, typedText.length);
    quoteInput.style.color = (typedText === quoteSubstring) ? 'green' : 'red';

    // Check if the input matches the quote text
    if (typedText === quoteText) {
        stopTest();
    }
}

// Event listeners
document.getElementById('start-test').addEventListener('click', startTest);
document.getElementById('stop-test').addEventListener('click', stopTest);
quoteInput.addEventListener('input', checkCompletion);
