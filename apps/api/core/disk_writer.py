import os
import re
import asyncio
from pathlib import Path

class DiskWriter:
    def __init__(self):
        # Creates a 'workspaces' directory right inside your apps/api folder
        self.workspace_root = Path(__file__).resolve().parent.parent / "workspaces"
        self.workspace_root.mkdir(exist_ok=True)

    async def write_project_files(self, project_id: int, generated_code: str):
        # Create a unique folder for this specific project run
        project_dir = self.workspace_root / f"project_{project_id}"
        project_dir.mkdir(exist_ok=True)

        print(f"[DISK WRITER] Materializing codebase for Project #{project_id}...")

        # Regex to extract all markdown code blocks from the AI's output
        pattern = re.compile(r'```(\w+)?\n(.*?)```', re.DOTALL)
        blocks = pattern.findall(generated_code)

        if not blocks:
            # Fallback: If the AI didn't use markdown blocks, dump it all in one file
            with open(project_dir / "raw_codebase.md", "w", encoding="utf-8") as f:
                f.write(generated_code)
            print(f"[DISK WRITER] Saved raw output to {project_dir.name}/raw_codebase.md")
            return

        # Write each code block to a physical file
        for i, (lang, code) in enumerate(blocks):
            # Map the markdown language tag to a real file extension
            ext_map = {
                'python': 'py', 'javascript': 'js', 'typescript': 'ts', 
                'tsx': 'tsx', 'json': 'json', 'html': 'html', 
                'css': 'css', 'sql': 'sql', 'bash': 'sh'
            }
            ext = ext_map.get(lang.lower() if lang else '', 'txt')

            file_path = project_dir / f"module_{i+1}.{ext}"
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code.strip() + "\n")
            
        print(f"[DISK WRITER] Successfully wrote {len(blocks)} files to {project_dir}/")

# Expose a global instance
disk_writer = DiskWriter()