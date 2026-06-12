import os
import re

dto_dir = r"backend/src/main/java/com/medstudy/backend"

def get_matching_paren(text, start_idx):
    paren_level = 0
    in_string = False
    escape = False
    for i in range(start_idx, len(text)):
        char = text[i]
        if escape:
            escape = False
            continue
        if char == '\\':
            escape = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        if not in_string:
            if char == '(':
                paren_level += 1
            elif char == ')':
                paren_level -= 1
                if paren_level == 0:
                    return i
    return -1

def parse_params(params_str):
    params = []
    current = []
    paren_level = 0
    in_string = False
    escape = False

    for char in params_str:
        if escape:
            current.append(char)
            escape = False
            continue

        if char == '\\':
            escape = True
            current.append(char)
            continue

        if char == '"':
            in_string = not in_string
            current.append(char)
            continue

        if not in_string:
            if char == '(':
                paren_level += 1
            elif char == ')':
                paren_level -= 1

        if char == ',' and paren_level == 0 and not in_string:
            params.append(''.join(current).strip())
            current = []
        else:
            current.append(char)

    if ''.join(current).strip():
        params.append(''.join(current).strip())
    
    return params

def convert_record_to_class(content):
    if "public record" not in content and "public static record" not in content:
        return content, False

    modified = False
    new_content = ""
    idx = 0

    while True:
        # find "public record" or "public static record"
        match = re.search(r'(public(?:\s+static)?)\s+record\s+(\w+)\s*\(', content[idx:])
        if not match:
            new_content += content[idx:]
            break
            
        modified = True
        start_match = idx + match.start()
        end_match = idx + match.end() - 1 # points to '('
        
        modifiers = match.group(1)
        class_name = match.group(2)
        
        new_content += content[idx:start_match]
        
        end_paren = get_matching_paren(content, end_match)
        if end_paren == -1:
            print("Error matching paren")
            return content, False
            
        params_str = content[end_match+1:end_paren]
        params = parse_params(params_str)
        
        # Check if there's a body { }
        body_start = -1
        body_end = -1
        body_str = ""
        
        # skip whitespaces after end_paren
        search_idx = end_paren + 1
        while search_idx < len(content) and content[search_idx].isspace():
            search_idx += 1
            
        if search_idx < len(content) and content[search_idx] == '{':
            body_start = search_idx
            # find matching brace
            brace_level = 0
            for i in range(body_start, len(content)):
                if content[i] == '{': brace_level += 1
                elif content[i] == '}':
                    brace_level -= 1
                    if brace_level == 0:
                        body_end = i
                        break
            if body_end != -1:
                body_str = content[body_start+1:body_end]
                idx = body_end + 1
            else:
                idx = search_idx
        else:
            idx = search_idx

        fields_str = []
        for p in params:
            if not p: continue
            
            # Replace validation messages
            p = re.sub(r'@NotBlank\(message\s*=\s*"[^"]+"\)', r'@NotBlank(message = ValidationMessages.FIELD_REQUIRED)', p)
            p = re.sub(r'@NotNull\(message\s*=\s*"[^"]+"\)', r'@NotNull(message = ValidationMessages.FIELD_REQUIRED)', p)
            p = re.sub(r'@Email\(message\s*=\s*"[^"]+"\)', r'@Email(message = ValidationMessages.INVALID_EMAIL)', p)
            p = re.sub(r'message\s*=\s*"[^"]+"', r'message = ValidationMessages.INVALID_FORMAT', p)
            
            # Extract type and name
            tokens = p.split()
            field_name = tokens[-1]
            field_type = tokens[-2] if len(tokens) >= 2 else "String"
            
            field_name = field_name.strip(',')
            
            desc = f"The {field_name} of the entity."
            example = "Example value"
            
            if "String" in field_type:
                if "email" in field_name.lower(): example = "user@example.com"
                elif "id" in field_name.lower(): example = "123e4567-e89b-12d3-a456-426614174000"
                elif "name" in field_name.lower(): example = "John Doe"
                else: example = "Sample text"
            elif field_type in ("int", "Integer", "long", "Long"):
                example = "1"
            elif field_type in ("boolean", "Boolean"):
                example = "true"
            elif "List" in field_type or "Set" in field_type:
                example = "[]"
                
            fields_str.append(f'    @Schema(description = "{desc}", example = "{example}")')
            fields_str.append(f'    private {p};')

        fields_joined = "\n".join(fields_str)
        
        replacement = f"""@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
{modifiers} class {class_name} {{
{fields_joined}
{body_str}
}}"""
        new_content += replacement

    if modified:
        imports = [
            "import lombok.Data;",
            "import lombok.Builder;",
            "import lombok.NoArgsConstructor;",
            "import lombok.AllArgsConstructor;",
            "import io.swagger.v3.oas.annotations.media.Schema;",
            "import com.medstudy.backend.core.constants.ValidationMessages;"
        ]
        
        for imp in imports:
            if imp not in new_content:
                new_content = re.sub(r'(package .*?;)', f'\\1\n{imp}', new_content, count=1)

    return new_content, modified

for root, dirs, files in os.walk(dto_dir):
    if "dto" in root:
        for file in files:
            if file.endswith(".java"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content, changed = convert_record_to_class(content)
                if changed:
                    print(f"Refactored {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
