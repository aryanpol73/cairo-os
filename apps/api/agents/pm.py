import asyncio
import json
from google import genai
from google.genai import types
from models.schemas import SwarmGraphState, ProjectSprintBacklog

class PMAgent:
    @staticmethod
    async def create_backlog(state: SwarmGraphState) -> dict:
        print("[PRODUCT MGR] Processing live system maps through async worker pool.")
        
        architecture_context = json.dumps(state.get("architecture", {}))
        user_prompt = state["prompt"]
        
        system_instruction = """
        You are a technical Product Manager Agent. You review a system architecture design blueprint and generate a list of concrete engineering tasks for a development team.
        You must output a JSON object matching the ProjectSprintBacklog schema containing an array of 'tasks'.
        - Each task must have a unique ID (e.g., 'TSK-01'), an engineering title, a status, and an assignee.
        - Assignees must be chosen from: 'Architect', 'Product Mgr', 'Developer', 'QA Tester'.
        """

        def call_gemini():
            client = genai.Client()
            return client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Based on the project prompt '{user_prompt}' and this generated layout: {architecture_context}, build an agile engineering backlog.",
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=ProjectSprintBacklog,
                    temperature=0.3
                ),
            )

        try:
            response = await asyncio.to_thread(call_gemini)
            backlog_dict = json.loads(response.text)
            
            return {
                "current_phase": "planning",
                "backlog": backlog_dict,
                "latest_log": {
                    "phase": "planning",
                    "agent": "Product Mgr",
                    "log": f"Agile sprint board mapping successful. Allocated {len(backlog_dict.get('tasks', []))} core technical feature milestones."
                }
            }
        except Exception as e:
            print(f"[PM THREAD CRASH] Exception: {e}")
            return {
                "current_phase": "planning",
                "backlog": {"tasks": []},
                "latest_log": {
                    "phase": "planning",
                    "agent": "Product Mgr",
                    "log": f"Product Manager failed to compile backlog maps."
                }
            }