import asyncio
import json
from google import genai
from google.genai import types
from models.schemas import SwarmGraphState, SystemArchitectureBlueprint

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
            client = genai.Client()
            return client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Design a complete architecture blueprint for this application concept: {prompt}",
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=SystemArchitectureBlueprint,
                    temperature=0.2
                ),
            )

        try:
            # Safely pass the synchronous network task to a background thread
            response = await asyncio.to_thread(call_gemini)
            blueprint_dict = json.loads(response.text)
            
            return {
                "current_phase": "architecting",
                "architecture": blueprint_dict,
                "latest_log": {
                    "phase": "architecting",
                    "agent": "Architect",
                    "log": f"Gemini successfully mapped a live software footprint containing {len(blueprint_dict.get('nodes', []))} system architecture layers."
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
                    "log": f"Inference engine bottleneck encountered. Falling back to default layout context."
                }
            }