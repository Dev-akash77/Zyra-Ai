import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { ZyraState } from "../../../common/types/state.type";

import { PlannerNode } from "./planner";
import { routerNode } from "./router";
import { researchAgentNode } from "../orchestrator/agents/research-agent";
import { synthesizerNode } from "./synthesizer";

// 1. Initialize Graph
const workflow = new StateGraph(ZyraState)
  .addNode("Planner", PlannerNode)
  .addNode("DelegationManager", routerNode)
  .addNode("ResearchAgent", researchAgentNode)
  .addNode("Synthesizer", synthesizerNode);

// 2. Wire Edges
workflow.addEdge(START, "Planner");
workflow.addEdge("Planner", "DelegationManager");

workflow.addConditionalEdges(
  "DelegationManager",
  (state) => state.nextDestination,
  {
    ResearchAgent: "ResearchAgent",
    Synthesizer: "Synthesizer",
  }
);

workflow.addEdge("ResearchAgent", "DelegationManager");
workflow.addEdge("Synthesizer", END);

// 3. Short Term Memory Checkpointer
const memory = new MemorySaver();

// 4. Export the compiled app (THIS BELONGS HERE!)
export const zyraApp = workflow.compile({
  checkpointer: memory,
});