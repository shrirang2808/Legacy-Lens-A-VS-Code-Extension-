import os
import sys
import ast
import re

def get_functions_from_ast(source_code):
    """Tries to get function names using the AST parser."""
    tree = ast.parse(source_code)
    return [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]

def get_functions_from_regex(source_code):
    """Gets function names using a fallback regex parser."""
    # A more robust regex to handle various 'def' statements, including decorators
    return re.findall(r'^\s*(?:@.*?\s+)?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(', source_code, re.MULTILINE)

def generate_tests_for_file(file_path, output_dir, warnings):
    """Generates a test file with scaffolds for functions found in the given file."""
    try:
        with open(file_path, 'r') as f:
            source_code = f.read()

        functions = []
        try:
            # First, try the robust AST parser
            functions = get_functions_from_ast(source_code)
        except Exception as e:
            # If that fails, fall back to a simple regex and add a warning
            warnings.append("AST parsing failed for {}. Falling back to regex. Error: {}".format(file_path, e))
            functions = get_functions_from_regex(source_code)
        
        if not functions:
            return # No functions to test

        file_name = os.path.basename(file_path)
        module_name = file_name.replace('.py', '')

        output_file_name = 'test_{}'.format(file_name)
        output_file_path = os.path.join(output_dir, output_file_name)

        with open(output_file_path, 'w') as f:
            f.write("import unittest\n")
            f.write("from .. import {}\n\n".format(module_name))
            f.write("class Test{}(unittest.TestCase):\n\n".format(module_name.title()))
            
            for func in functions:
                f.write("    def test_{}(self):\n".format(func))
                f.write("        # TODO: Add assertions here\n")
                f.write("        pass\n\n")

    except Exception as e:
        # Only write truly fatal, unhandled errors to stderr
        sys.stderr.write("Fatal error processing file {}: {}\n".format(file_path, e))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        root_folder = sys.argv[1]
        
        if not os.path.isdir(root_folder):
            sys.stderr.write("Error: The provided path is not a valid directory.\n")
            sys.exit(1)
        
        test_output_dir = os.path.join(root_folder, "tests")
        if not os.path.exists(test_output_dir):
            os.makedirs(test_output_dir)

        warnings = []
        for dirpath, _, filenames in os.walk(root_folder):
            for filename in filenames:
                if filename.endswith(".py") and filename != "test_gen.py":
                    file_path = os.path.join(dirpath, filename)
                    generate_tests_for_file(file_path, test_output_dir, warnings)

        # Print final messages and warnings to stdout
        sys.stdout.write("Tests saved in {}/tests/".format(root_folder))
        if warnings:
            sys.stdout.write("\n\nWarnings:\n" + "\n".join(warnings))
        sys.exit(0)
    else:
        sys.stderr.write("Error: No folder path provided.\n")
        sys.exit(1)