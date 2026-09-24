import { ZyraState, CompletedTask } from "../../../../common/types/state.type";
import {GENT_PERSONAS } from "../../../../common/services/prompt/system_prompt";
import { weatherTool } from "../../tools/weather.tool";
import { model } from "../llm";

//bind tool to the model 
const modelWithTools = model.bindTools([weatherTool]);


// 3. The LangGraph Node Function
export async function researchAgentNode(state: typeof ZyraState.State) {
  const instruction = state.currentTask;

  console.log(`\n [ResearchAgent] Executing: "${instruction}"`);

  try {
    // call the model with persona and instruction
    const response = await modelWithTools.invoke([
      {role:"system",content:GENT_PERSONAS.ResearchAgent},{
        role:"human",content:instruction
      }
    ]);

    let finalOutput = "";

    // If the model chose to call the weather tool
    if(response.tool_calls && response.tool_calls.length > 0){
         for (const call of response.tool_calls) {
       if (call.name === weatherTool.name) {
          // Execute the tool
          const toolResult = await weatherTool.invoke(call.args as any);
          // Give the tool result back to the model to synthesize a final answer
          const synthesized = await model.invoke([
            { role: "system", content: GENT_PERSONAS.ResearchAgent },
            { role: "user", content: instruction },
            response,
            {
              role: "tool",
              tool_call_id: call.id,
              content: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult),
            },
          ]);
          finalOutput = synthesized.content.toString();
        }
      }
    }else{
        // Model answered without needing tools
      finalOutput = response.content.toString();
    }
    
    const record : CompletedTask = {
        agentName:"ResearchAgent",
        taskDescription: instruction,
      output: finalOutput,
    }
    // Return state update back to the Delegation Manager
    return {
      completedTasks: [record],
      nextDestination: "DelegationManager",
    };
  } catch (error: any) {
    console.error(`[ResearchAgent] Error:`, error);

    const failureRecord: CompletedTask = {
      agentName: "ResearchAgent",
      taskDescription: instruction,
      output: `Error executing research task: ${error.message || error}`,
    };

    return {
      completedTasks: [failureRecord],
      nextDestination: "DelegationManager",
    };
  }
}
