import { z } from "zod";
import { ZyraState } from "../../../common/types/state.type";
import {
    DELEGATION_MANAGER_SYSTEM_PROMPT,
    buildDelegationContext,
} from "../../../common/services/prompt/system_prompt";
import { model } from "./llm";
// 1. Schema for routing decision
const RouterSchema = z.object({
    nextAgent: z
        .enum(["ResearchAgent", "Synthesizer"])
        .describe("Route to 'ResearchAgent' if work remains, or 'Synthesizer' when all tasks are finished."),
    taskInstruction: z
        .string()
        .describe("Clear, concise instruction for the selected agent. Empty string if routing to Synthesizer."),
});


export async function routerNode(state: typeof ZyraState.State) {
    console.log("\n [Delegation Manager] Evaluating current progress...");

    const userGoal =
        state.messages[state.messages.length - 1]?.content?.toString() || "";

    // Prepare clean markdown context of plan & completed work
    const dynamicContext = buildDelegationContext({
        plan: state.plan,
        completedTasks: state.completedTasks,
        userGoal,
    });

    const structuredRouter = model.withStructuredOutput(RouterSchema);

    const decision = await structuredRouter.invoke([
        { role: "system", content: DELEGATION_MANAGER_SYSTEM_PROMPT },
        { role: "user", content: dynamicContext },
    ]);

    console.log(`[Delegation Manager] Next target: "${decision.nextAgent}"`);
    if (decision.taskInstruction) {
        console.log(`[Delegation Manager] Task: "${decision.taskInstruction}"`);
    }

    return {
        nextDestination: decision.nextAgent,
        currentTask: decision.taskInstruction,
    };
}