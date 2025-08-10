# LegacyLens: A VS Code Extension for Python 2 Codebase Analysis

## Project Summary
LegacyLens is a Visual Studio Code extension designed to assist developers in the challenging task of modernizing legacy Python 2 codebases to Python 3. It provides three powerful functionalities: Analysis of project's in-depth structure (classes and objects) and generating prompts for the same, visualizing the project's architectural structure and generating unit test scaffolds. By automating these initial, time-consuming steps, LegacyLens helps streamline the refactoring and migration process.

## Tech Stack
The extension is built using the following technologies:
* **Extension Host:** Visual Studio Code API
* **Runtime Environment:** Node.js
* **Language:** JavaScript (for extension logic) and Python (for core analysis scripts)
* **Visualization Engine:** Mermaid.js (for generating architectural diagrams)
* **Testing Framework:** Python's built-in `unittest`
* **Version Control:** Git

## Features
1.  **Code Analysis and Prompt Generation:** The core engine analyzes the project's structure, classes, and functions to generate an in-depth understanding. This analysis is the basis for all other features.
2.  **Visualize Architecture:** Creates an interactive architectural diagram of the entire codebase, providing a high-level overview of the file and folder structure. This diagram is zoomable and pannable for easy navigation of large projects.
3.  **Generate Unit Tests:** Automatically scans a Python 2 codebase and generates a `unit test` scaffold for each function. This helps developers begin writing tests to ensure code integrity during refactoring.

## How to Use
### 1. Installation and Setup
1.  Clone this repository to your local machine:
2.  Open the project in VS Code.
3.  Install the Node.js dependencies:
4.  Press `F5` to open a new VS Code Extension Development Host window.

### 2. Running the Commands
Once the new window is open:
1.  Open the folder of a legacy Python 2 codebase you want to analyze
2.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3.  Run the commands:
    * **LegacyLens: Analyze Python 2 Codebase:** This will create a `modernization_prompts` folder within your directory which will contain prompts for all the python files which when pasted in any AI tool will generate exactly same code in Python 3. 
    * **LegacyLens: Visualize Architecture:** This will open a new tab showing a zoomable and pannable architectural diagram of your project.
    * **LegacyLens: Generate Unit Tests:** This will create a `tests/` folder with unit test scaffolds for each Python file.

### 3. Personal Data
The extension has been configured to not use any hard-coded file paths. All file analysis is performed on the folder you select at runtime.




