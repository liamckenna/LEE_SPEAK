import re

file_path = "content/trigger/comment-version.md"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.startswith("comment_version:"):
        current = int(re.findall(r'\d+', line)[0])
        lines[i] = f"comment_version: {current + 1}\n"
        break

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"comment_version bumped to {current + 1}")
