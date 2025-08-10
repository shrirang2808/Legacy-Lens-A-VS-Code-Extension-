import os
import sys

def get_mermaid_structure(root_folder):
    """
    Recursively builds a dictionary representing the file/folder structure.
    """
    structure = {}
    for dirpath, dirnames, filenames in os.walk(root_folder):
        current_dir = structure
        path_parts = os.path.relpath(dirpath, root_folder).split(os.sep)
        
        # Traverse the structure dictionary to the current directory
        if path_parts != ['.']:
            for part in path_parts:
                if part not in current_dir:
                    current_dir[part] = {}
                current_dir = current_dir[part]
        
        # Add files to the current directory
        for filename in filenames:
            if filename.endswith('.py'):
                current_dir[filename] = None # Use None to indicate a file

    return structure

def generate_mermaid_from_structure(structure, path_prefix="", level=1):
    """
    Recursively generates Mermaid syntax from the structure dictionary.
    """
    mermaid_syntax = ""
    for name, content in structure.items():
        unique_id = path_prefix.replace('.', '_').replace('-', '_').replace(os.sep, '_') + name.replace('.', '_').replace('-', '_')

        if content is None: # It's a file
            mermaid_syntax += "        " * level + f"{unique_id}[\"{name}\"]\n"
        else: # It's a directory
            mermaid_syntax += "        " * level + f"subgraph {unique_id}[{name}]\n"
            mermaid_syntax += generate_mermaid_from_structure(content, path_prefix=path_prefix + name + os.sep, level=level + 1)
            mermaid_syntax += "        " * level + "end\n"
            
    return mermaid_syntax

if __name__ == "__main__":
    if len(sys.argv) > 1:
        root_folder = sys.argv[1]
        
        if not os.path.isdir(root_folder):
            sys.stderr.write("Error: The provided path is not a valid directory.\n")
            sys.exit(1)
            
        structure = get_mermaid_structure(root_folder)
        
        mermaid_code = "graph TD\n"
        mermaid_code += "    subgraph codebase[Codebase]\n"
        mermaid_code += generate_mermaid_from_structure(structure, path_prefix="", level=2)
        mermaid_code += "    end\n"
        
        print(mermaid_code)
        sys.exit(0)
    else:
        sys.stderr.write("Error: No folder path provided.\n")
        sys.exit(1)