Poetry Assistant: Algorithmic Text Generation
A web application that utilizes dictionary-based searching and string manipulation to generate rhyming and alliterative poetry. This project was developed to demonstrate efficiency in data handling, input validation, and algorithm design within JavaScript.

- Technical Overview
The application processes a large external wordlist to identify linguistic patterns. It is built using a modular architecture to separate data fetching, algorithmic logic, and UI rendering.

Core Algorithms
1. Rhyme Generation (Suffix Matching)
The rhyming engine identifies words sharing identical ending sequences.

Mechanism: It extracts the last 3 characters of the user's input and performs a linear scan across the WORDLIST array.

Logic: To ensure variety, it filters out the input word itself and uses a selection algorithm to curate the final poem structure.

2. Alliteration Generation (Prefix Matching)
The alliteration engine finds words that share the same starting character.

Mechanism: It performs a filter operation on the WORDLIST based on the first character (charAt(0)) of the target word.

Randomization: It uses a Fisher-Yates inspired selection to pick a subset of words, ensuring that every generated poem is unique even with the same input.

Data Structures
Global Wordlist (Array): A large, flat array structure used as the primary dictionary. Words are normalized (trimmed and lowercased) during the fetch phase to optimize comparison operations.

Constraint Objects: A Key-Value pair structure used to define and enforce input boundaries (min/max length), adhering to Defense-in-Depth security principles.

- Security & Validation
Following the OWASP (Open Web Application Security Project) guidelines, the application implements:

Input Sanitization: Regex-based filtering to allow only alphabetic characters.

Logic Layer Constraints: Secondary JavaScript checks that mirror HTML maxlength attributes to prevent bypass via the console.

Error Handling: Async/Await blocks with try-catch logic to handle potential network failures during the wordlist.txt fetch.

- Project Structure
index.html: The presentation layer, styled with Tailwind CSS for a responsive, modern UI.

poetryAssistant.js: The logic layer containing the WORDLIST state, searching algorithms, and event listeners.

wordlist.txt: The data source containing a comprehensive list of English words used for pattern matching.

- Getting Started
Prerequisites
A modern web browser (Chrome, Firefox, Edge).

A local server environment (due to CORS policy when fetching wordlist.txt).

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/poetry-assistant.git
Launch a local server in the project directory:

Using VS Code: Use the "Live Server" extension.

Using Python: Run python -m http.server 8000.

Open http://localhost:8000 in your browser.
