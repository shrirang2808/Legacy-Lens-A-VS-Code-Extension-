import os
import sys

def find_python2_features(file_content):
    """Scans file content for common Python 2-specific syntax."""
    features = []
    
    # Check for print statements
    if "print " in file_content:
        features.append("This file uses Python 2 `print` statements instead of the `print()` function.")
    
    # Check for xrange
    if "xrange" in file_content:
        features.append("The file uses `xrange`, which was replaced by a more efficient `range` in Python 3.")
        
    # Check for iteritems()
    if ".iteritems()" in file_content:
        features.append("The file uses `.iteritems()`, which was renamed to `.items()` in Python 3.")
        
    # Check for integer division (a simple check, but good for an example)
    if "/" in file_content and "from __future__ import division" not in file_content:
        # A more advanced check would be needed for a real tool, but this is a start.
        features.append("The file might be using Python 2's integer division (`/`).")

    return features

def create_markdown_prompt(file_path, file_content, features):
    """Generates a markdown prompt for a given Python file."""
    prompt = f"### File: {file_path}\n"
    prompt += "This Python file is written in Python 2 and needs to be converted to Python 3.\n\n"
    
    if features:
        prompt += "**Key Python 2 features to address:**\n"
        for feature in features:
            prompt += f"- {feature}\n"
        prompt += "\n"

    prompt += "Please provide the equivalent code for this file, refactored for Python 3 syntax and best practices. "
    prompt += "The output should contain the full, converted code.\n\n"
    prompt += "```python\n"
    prompt += file_content
    prompt += "\n```\n\n---\n\n"
    
    return prompt

if __name__ == "__main__":
    if len(sys.argv) > 1:
        root_folder = sys.argv[1]
        markdown_output = "# Python 2 to Python 3 Conversion Prompts\n\n"
        
        # Walk through all files in the directory
        for dirpath, _, filenames in os.walk(root_folder):
            for filename in filenames:
                if filename.endswith(".py"):
                    file_path = os.path.join(dirpath, filename)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            file_content = f.read()
                            features = find_python2_features(file_content)
                            
                            # Only create a prompt if Python 2 features were found
                            if features:
                                markdown_output += create_markdown_prompt(file_path, file_content, features)
                                
                    except Exception as e:
                        print(f"Error processing file {file_path}: {e}")
        
        # Save the generated prompts to a markdown file
        output_file_path = os.path.join(root_folder, "modernization_prompts.md")
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(markdown_output)
            
        print(output_file_path)
        
    else:
        print("Error: No folder path provided.")
        sys.exit(1)