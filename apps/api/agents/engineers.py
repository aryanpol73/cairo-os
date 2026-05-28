import asyncio
import json
import os
import google.generativeai as genai
from models.schemas import SwarmGraphState

# Configure API Key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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
            # Use the stable GenerativeModel class
            model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=system_instruction
            )
            
            # Generate content using the dictionary config
            return model.generate_content(
                f"Generate production code files for project '{user_prompt}' matching this structure: {architecture_context}",
                generation_config={"temperature": 0.3}
            )

        try:
            response = await asyncio.to_thread(call_gemini)
            return response.text if response.text else "// Code allocation cleared."
        except Exception as e:
            print(f"[DEVELOPER THREAD CRASH] Exception: {e}")
            return f"// Developer Agent failed to compile codebase module: {str(e)}"