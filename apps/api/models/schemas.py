from pydantic import BaseModel, Field
from typing import List, Literal, TypedDict

# --- 1. ARCHITECTURE GRAPH SCHEMAS ---
class TopologyNode(BaseModel):
    id: str = Field(description="Unique identifier for the node (e.g., 'api-gateway', 'db')")
    label: str = Field(description="Display name of the component (e.g., 'FastAPI Gateway')")
    type: Literal['client', 'server', 'database', 'cache'] = Field(description="Infrastructure classification type")

class TopologyEdge(BaseModel):
    source: str = Field(description="The ID of the source node originating the link")
    target: str = Field(description="The ID of the destination node receiving the link")
    animated: bool = Field(default=True, description="Whether the network connection line pulses fluidly")

class SystemArchitectureBlueprint(BaseModel):
    nodes: List[TopologyNode]
    edges: List[TopologyEdge]

# --- 2. SPRINT BOARD SCHEMAS ---
class SprintTask(BaseModel):
    id: str = Field(description="Task identifier (e.g., 'TASK-01')")
    title: str = Field(description="High-level engineering task name")
    status: Literal['backlog', 'todo', 'in_progress', 'done'] = Field(default='backlog')
    assignee: Literal['Architect', 'Product Mgr', 'Developer', 'QA Tester']

class ProjectSprintBacklog(BaseModel):
    tasks: List[SprintTask]

# --- 3. THE LANGGRAPH COMPATIBLE STATE MACHINE CORE ---
class SwarmGraphState(TypedDict):
    prompt: str
    current_phase: str
    architecture: dict
    backlog: dict
    generated_code: str
    latest_log: dict