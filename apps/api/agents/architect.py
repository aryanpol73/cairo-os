import asyncio
import json
import os
import google.generativeai as genai
from models.schemas import SwarmGraphState, SystemArchitectureBlueprint

# Ensure the API key is configured using the key from the environment
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ArchitectAgent:
    @staticmethod
    async def design_topology(state: SwarmGraphState) -> dict:
        prompt = state["prompt"]
        print(f"[ARCHITECT] Dispatching background inference thread for: '{prompt}'")
        
        system_instruction = """
        You are an elite Cloud Solutions Architect Agent. Your job is to analyze the user's software concept and design a production-grade infrastructure blueprint.
        Break the system down into high-level components. You must output a JSON object matching the requested schema containing 'nodes' and 'edges'.
        - Node 'type' must be exactly one of: 'client', 'server', 'database', 'cache'.
        - Edges connect the nodes together logically via 'source' and 'target' IDs.
        """

        # Thread-safe synchronous execution block wrapper
        def call_gemini():
            # Standard model initialization
            model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=system_instruction
            )
            
            # Using dictionary-based generation_config to avoid 'types' dependency
            return model.generate_content(
                f"Design a complete architecture blueprint for this application concept: {prompt}",
                generation_config={
                    "response_mime_type": "application/json",
                    "temperature": 0.2
                }
            )

        try:
            response = await asyncio.to_thread(call_gemini)
            blueprint_dict = json.loads(response.text)
            
            return {
                "current_phase": "architecting",
                "architecture": blueprint_dict,
                "latest_log": {
                    "phase": "architecting",
                    "agent": "Architect",
                    "log": f"Gemini mapped a software footprint with {len(blueprint_dict.get('nodes', []))} layers."
                }
            }
            
        except Exception as e:
            print(f"[ARCHITECT THREAD CRASH] Exception: {e}")
            return {
                "current_phase": "architecting",
                "architecture": {"nodes": [], "edges": []},
                "latest_log": {
                    "phase": "architecting",
                    "agent": "Architect",
                    "log": "Inference engine bottleneck. Falling back to default."
                }
            }