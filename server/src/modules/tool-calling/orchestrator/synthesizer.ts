import { ZyraState } from "../../../common/types/state.type";
import { SYNTHESIZER_SYSTEM_PROMPT } from "../../../common/services/prompt/system_prompt";
import { model } from "./llm"; 
export async function synthesizerNode(state: typeof ZyraState.State) {
  console.log("\n[Synthesizer] Compiling final response for user...");

  const userGoal =
    state.messages[state.messages.length - 1]?.content?.toString() || "";

  const deliverables = state.completedTasks
    .map(
      (t, idx) =>
        `### Deliverable ${idx + 1} (${t.agentName})\n**Task:** ${t.taskDescription}\n**Result:**\n${t.output}`
    )
    .join("\n\n");

  const prompt = `
User Query: "${userGoal}"

Agent Deliverables:
${deliverables}

Please generate the final polished answer.
`.trim();

  const response = await model.invoke([
    { role: "system", content: SYNTHESIZER_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);

  return {
    finalResponse: response.content.toString(),
  };
}