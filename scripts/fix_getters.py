import os
import re

error_file = "backend/test_compile_errors.txt"
with open(error_file, 'r', encoding='utf-16') as f:
    lines = f.readlines()

errors = []
current_file = None
current_line = None
current_method = None

for line in lines:
    if "[ERROR] /C:/" in line or "[ERROR] \\C:\\" in line or "[ERROR] /C:\\" in line:
        match = re.search(r'\[ERROR\] [/\\]?([A-Za-z]:[\\/].*?):\[(\d+),\d+\] cannot find symbol', line)
        if match:
            path = match.group(1).replace('/', '\\')
            current_file = path
            current_line = int(match.group(2))
    elif "[ERROR]   symbol:   method" in line and current_file:
        match = re.search(r'method (\w+)\(\)', line)
        if match:
            current_method = match.group(1)
            errors.append({
                "file": current_file,
                "line": current_line,
                "method": current_method
            })
            current_file = None
            current_line = None
            current_method = None

files_to_fix = {}
for err in errors:
    fpath = err['file']
    if fpath not in files_to_fix:
        files_to_fix[fpath] = []
    files_to_fix[fpath].append(err)

for fpath, errs in files_to_fix.items():
    if not os.path.exists(fpath):
        print(f"File not found: {fpath}")
        continue
        
    with open(fpath, 'r', encoding='utf-8') as f:
        file_lines = f.readlines()
        
    for err in errs:
        line_idx = err['line'] - 1
        method = err['method']
        
        new_method = "get" + method[0].upper() + method[1:]
        
        if method in file_lines[line_idx]:
            file_lines[line_idx] = file_lines[line_idx].replace(method + "()", new_method + "()")
            
    with open(fpath, 'w', encoding='utf-8') as f:
        f.writelines(file_lines)
    print(f"Fixed {len(errs)} errors in {fpath}")
