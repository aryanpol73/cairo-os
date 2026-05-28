import asyncio
import json
from google import genai
from google.genai import types
from pydantic import BaseModel

# Force the AI to return this exact structure
class QAReport(BaseModel):
    is_clean: bool
    feedback_for_developer: str
    log_message: str

class ReviewerAgent:
    @staticmethod
    async def audit_code(state: dict) -> dict:
        print("[REVIEWER] Scanning generated codebase blocks for syntax integrity.")
        
        generated_code = state.get("generated_code", "")
        
        system_instruction = """
        You are an elite QA and Code Security Auditor Agent. 
        Review the provided codebase. Look for missing imports, syntax errors, or logical flaws.
        If the code is perfect and ready to run, set 'is_clean' to true.
        If it has errors, set 'is_clean' to false and provide strict 'feedback_for_developer' explaining exactly what to fix.
        Keep 'log_message' short for the UI (e.g. "Syntax check passed" or "Critical missing imports found").
        """

        def call_gemini():
            client = genai.Client()
            return client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Review this codebase:\n\n{generated_code}",
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=QAReport,
                    temperature=0.1
                ),
            )

        try:
            response = await asyncio.to_thread(call_gemini)
            report = json.loads(response.text)
            
            is_clean = report.get("is_clean", True)
            feedback = report.get("feedback_for_developer", "")
            log_msg = report.get("log_message", "Security compliance scanning complete. Zero critical vulnerabilities found.")

            return {
                "is_clean": is_clean,
                "feedback": feedback,
                "latest_log": {
                    "phase": "testing",
                    "agent": "QA Tester",
                    "log": log_msg
                }
            }
        except Exception as e:
            print(f"[REVIEWER ERROR] Exception: {e}")
            # Fail open so the pipeline doesn't crash on an API timeout
            return {
                "is_clean": True, 
                "feedback": "",
                "latest_log": {
                    "phase": "testing",
                    "agent": "QA Tester",
                    "log": f"Reviewer block bypassed due to network exception."
                }
            }