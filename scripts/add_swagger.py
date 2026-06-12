import os
import re

dto_dir = r"backend/src/main/java/com/medstudy/backend"
auth_dto_dir = r"backend/src/main/java/com/medstudy/backend/auth/dto"

def add_swagger_and_validation(content):
    # Regex to find private fields
    field_pattern = re.compile(r'^\s*private\s+([\w<>,\s]+)\s+(\w+)\s*;', re.MULTILINE)
    
    # Check if Swagger imports exist
    has_schema = "import io.swagger.v3.oas.annotations.media.Schema;" in content
    has_validation_messages = "import com.medstudy.backend.core.constants.ValidationMessages;" in content
    
    if not has_schema:
        content = re.sub(r'(package .*?;)', r'\1\n\nimport io.swagger.v3.oas.annotations.media.Schema;', content, count=1)
        
    if not has_validation_messages and ("@NotBlank" in content or "@NotNull" in content or "@Email" in content or "@Size" in content):
        content = re.sub(r'(package .*?;)', r'\1\nimport com.medstudy.backend.core.constants.ValidationMessages;', content, count=1)
    
    # Replace standard validation messages
    content = re.sub(r'@NotBlank\(message\s*=\s*"[^"]+"\)', r'@NotBlank(message = ValidationMessages.FIELD_REQUIRED)', content)
    content = re.sub(r'@NotNull\(message\s*=\s*"[^"]+"\)', r'@NotNull(message = ValidationMessages.FIELD_REQUIRED)', content)
    content = re.sub(r'@Email\(message\s*=\s*"[^"]+"\)', r'@Email(message = ValidationMessages.INVALID_EMAIL)', content)
    
    # Add @Schema
    def replacer(match):
        field_type = match.group(1).strip()
        field_name = match.group(2)
        
        # Don't add @Schema if already present immediately before
        idx = match.start()
        text_before = content[:idx]
        if "@Schema" in text_before[-50:]:
            return match.group(0)
            
        desc = f"The {field_name} of the entity."
        example = "Example value"
        
        # Simple heuristics for examples
        if "String" in field_type:
            if "email" in field_name.lower(): example = "user@example.com"
            elif "id" in field_name.lower(): example = "123e4567-e89b-12d3-a456-426614174000"
            elif "name" in field_name.lower(): example = "John Doe"
            else: example = "Sample text"
        elif field_type in ("int", "Integer", "long", "Long"):
            example = "1"
        elif field_type in ("boolean", "Boolean"):
            example = "true"
            
        schema_annotation = f'    @Schema(description = "{desc}", example = "{example}")\n'
        return schema_annotation + match.group(0)

    new_content = field_pattern.sub(replacer, content)
    return new_content

for root, dirs, files in os.walk(dto_dir):
    if "dto" in root:
        for file in files:
            if file.endswith(".java"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                print(f"Adding Swagger to {filepath}")
                new_content = add_swagger_and_validation(content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
