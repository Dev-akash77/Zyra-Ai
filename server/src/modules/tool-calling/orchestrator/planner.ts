import {z} from "zod";
import { ZyraState } from "../../../common/types/state.type";
import { PLANNER_SYSTEM_PROMPT } from "../../../common/services/prompt/system_prompt";
import { model } from "./llm";

//force LLM to output a strict array of plans steps
const planSchema = z.object({
    steps:z.array(z.string()).describe("Ordered list of tasks to accomplish the user's goal."),
});


export async function PlannerNode(state:typeof ZyraState.State) {
    console.log("planner executing formulating plan...");

    // Extract the latest user request
  const lastUserMessage =
    state.messages[state.messages.length - 1]?.content?.toString() || "";
  // Bind the schema for guaranteed JSON structure
  const structuredPlanner = model.withStructuredOutput(planSchema);
  const response = await structuredPlanner.invoke([
    { role: "system", content: PLANNER_SYSTEM_PROMPT },
    { role: "user", content: `User Goal: "${lastUserMessage}"` },
  ]);
  console.log("[Planner] Plan created:", response.steps);

    return {plan:response.steps,nextDestination:"DelegationManager"};
}

