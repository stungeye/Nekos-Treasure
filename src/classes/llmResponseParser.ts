interface ParsedResponse {
  messageForUser: string;
  attemptMade: boolean;
  correctGuess: boolean;
}

function parseLLMResponse(response: string): ParsedResponse | null {
  // Remove any leading/trailing whitespace and newlines
  response = response.trim();

  // Check if the response is wrapped in <response> tags
  const responseRegex = /^<response>\s*([\s\S]*)\s*<\/response>$/;
  const responseMatch = response.match(responseRegex);

  if (!responseMatch) {
    console.error("Invalid LLM response format: Missing <response> tags");
    return null;
  }

  const responseContent = responseMatch[1];

  // Regular expressions to match each part of the response, allowing for newlines and whitespace
  const messageRegex = /<messageForUser>\s*([\s\S]*?)\s*<\/messageForUser>/;
  const attemptMadeRegex = /<attemptMade>\s*(true|false)\s*<\/attemptMade>/;
  const correctGuessRegex = /<correctGuess>\s*(true|false)\s*<\/correctGuess>/;

  // Extract parts
  const messageMatch = responseContent.match(messageRegex);
  const attemptMadeMatch = responseContent.match(attemptMadeRegex);
  const correctGuessMatch = responseContent.match(correctGuessRegex);

  // Check if all required tags are present
  if (!messageMatch || !attemptMadeMatch || !correctGuessMatch) {
    console.error("Invalid LLM response format: Missing required tags");
    return null;
  }

  // Parse the extracted parts
  const messageForUser = messageMatch[1].trim();
  const attemptMade = attemptMadeMatch[1].toLowerCase() === "true";
  const correctGuess = correctGuessMatch[1].toLowerCase() === "true";

  return {
    messageForUser,
    attemptMade,
    correctGuess,
  };
}

export { parseLLMResponse };
