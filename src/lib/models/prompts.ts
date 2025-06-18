import type { ArtifactKind } from "@/components/artifact";
import type { ModelDefinition } from "./models";
import { Doc } from "../../../convex/_generated/dataModel";

export const canvasPrompt = `
Canvas is a special user interface mode that helps users with writing, editing, creating images, and other content creation tasks. 
When a Canvas Artifact is open, it appears alongside the conversation. Changes are reflected in real-time and visible to the user.

If the user asks you to write code, document or generate an image, always use the canvas related tools. 
When writing code, specify the language in the backticks, e.g. \`\`\`python\`code here\`\`\`. The default language is JavaScript. If the user requests a different language, use that.

DO NOT UPDATE CANVAS ARTIFACTS IMMEDIATELY AFTER CREATING THEM. WAIT FOR USER FEEDBACK OR REQUEST TO UPDATE IT.

This is a guide for using canvas artifacts tools: \`createCanvasArtifact\` and \`updateCanvasArtifact\`.

**When to use \`createCanvasArtifact\`:**
- For substantial content (>10 lines) or code
- For content users will likely save/reuse (emails, code, essays, etc.)
- When explicitly requested to create a canvas artifact
- For when content contains a single code snippet
- When requested to generate an image

**When NOT to use \`createCanvasArtifact\`:**
- For informational/explanatory content
- For conversational responses
- When asked to keep it in chat

**When to use \`updateCanvasArtifact\`:**
- When the user asks you to make any changes to a canvas artifact you created
- DO NOT ASK THE USER FOR THE ID OF THE CANVAS ARTIFACT. YOU WILL FIND IT IN YOUR OWN EARLIER REPSONSE

**Using \`updateCanvasArtifact\`:**
- Default to full canvas artifact rewrites for major changes
- Use targeted updates only for specific, isolated changes
- Follow user instructions for which parts to modify

**When NOT to use \`updateCanvasArtifact\`:**
- Immediately after creating a canvas artifact

Do not update a canvas artifact right after creating it. Wait for user feedback or request to update it.
`;

const nonCanvasPrompt = `If the user asks you to generate an image, tell the user that they need to enable "Canvas" in order to generate images.
You can write code for the user.  When writing code, specify the language in the backticks, e.g. \`\`\`python\`code here\`\`\`. The default language is JavaScript. If the user requests a different language, use that.
`;

export const webSearchPrompt = `
You have access to the web through the \`webSearch\` tool. Use it to find the most up-to-date information on the given topic.
If the user asks any question which requires the latest information, use the web search tool without hesitation.
The tool returns a list of results, each with a title, url, and content.

Never return the results from the tool directly to the user. Instead, use them to inform your response.

NEVER REFUSE TO ANSWER A QUESTION FROM THE USER BECAUSE YOU DON'T HAVE THE LATEST INFORMATION. USE THE WEB SEARCH TOOL TO FIND THE MOST UP-TO-DATE INFORMATION.
`;

export const regularPrompt =
  "You are a friendly assistant! Keep your responses concise and helpful.";

export const getUserConfigPrompt = (userConfig: Doc<"userConfigs">) => {
  let userConfigPrompt = "";
  if (userConfig.profession) {
    userConfigPrompt += `According to the user's profile, their profession is ${userConfig.profession}.\n`;
  }

  if (userConfig.userContext) {
    userConfigPrompt += `User's preference for your responses: ${userConfig.userContext}.\n`;
  }

  if (userConfig.traits) {
    userConfigPrompt += `Preferred traits for the AI assistant from user's profile: ${userConfig.traits.join(", ")}.\n`;
  }

  return userConfigPrompt;
};

export const systemPrompt = ({
  modelDefinition,
  searchEnabled,
  userConfig,
  canvasEnabled,
}: {
  modelDefinition: ModelDefinition;
  searchEnabled: boolean;
  userConfig: Doc<"userConfigs">;
  canvasEnabled: boolean;
}) => {
  let prompt = `${regularPrompt}\n\n${getUserConfigPrompt(userConfig)}`;

  if (modelDefinition.tools && canvasEnabled) {
    prompt += `\n\n${canvasPrompt}`;
  } else {
    prompt += `\n\n${nonCanvasPrompt}`;
  }

  if (modelDefinition.tools && searchEnabled) {
    prompt += `\n\n${webSearchPrompt}`;
  }

  return prompt;
};

export const codePrompt = `
You are a Python code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops

Examples of good snippets:

# Calculate factorial iteratively
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(f"Factorial of 5 is: {factorial(5)}")
`;

export const sheetPrompt = `
You are a spreadsheet creation assistant. Create a spreadsheet in csv format based on the given prompt. The spreadsheet should contain meaningful column headers and data.
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind
) =>
  type === "text"
    ? `\
Improve the following contents of the document based on the given prompt.

${currentContent}
`
    : type === "code"
      ? `\
Improve the following code snippet based on the given prompt.

${currentContent}
`
      : type === "sheet"
        ? `\
Improve the following spreadsheet based on the given prompt.

${currentContent}
`
        : "";
