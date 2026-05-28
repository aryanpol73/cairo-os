import asyncio
import json
from google import genai
from google.genai import types
from models.schemas import SwarmGraphState

class DeveloperAgent:
    @staticmethod
    async def build_codebase(state: SwarmGraphState) -> str:
        print("[DEVELOPER] Assembling codebase framework layout using background worker.")
        
        user_prompt = state["prompt"]
        architecture_context = json.dumps(state.get("architecture", {}))
        
        system_instruction = """
        You are an expert Lead Developer Agent. You look at an application prompt and a network topology blueprint, then generate clean, real, executable boilerplate code files.
        Return raw markdown code blocks. Do not add casual conversational filler words.
        """

        def call_gemini():
            client = genai.Client()
            return client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Generate production code files for project '{user_prompt}' matching this structure: {architecture_context}",
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.3
                ),
            )

        try:
            response = await asyncio.to_thread(call_gemini)
            return response.text if response.text else "// Code allocation cleared."
        except Exception as e:
            print(f"[DEVELOPER THREAD CRASH] Exception: {e}")
            return f"// Developer Agent failed to compile codebase module: {str(e)}"