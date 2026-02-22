# Github Issue Command Selection

CRITICAL: Your response must be ONLY a single command string. No file paths. No explanations. No markdown. No spec files. Just the command.

Based on the `Github Issue` below, follow the `Instructions` to select the appropriate command to execute based on the `Command Mapping`.

## Instructions

- Based on the details in the `Github Issue`, select the appropriate command to execute.
- IMPORTANT: Respond exclusively with '/' followed by the command to execute based on the `Command Mapping` below.
- Use the command mapping to help you decide which command to respond with.
- Don't examine the codebase just focus on the `Github Issue` and the `Command Mapping` below to determine the appropriate command to execute.

## Command Mapping

- Respond with `/chore` if the issue is a chore (maintenance, refactoring, dependency updates, config changes).
- Respond with `/bug` if the issue is a bug (something is broken, error, unexpected behavior).
- Respond with `/feature` if the issue is a feature (new functionality, enhancement, UI addition).
- Respond with `0` if the issue isn't any of the above.

## Github Issue

$ARGUMENTS

## Output Rules

CRITICAL REMINDERS - Read these carefully:
- DO NOT return a file path. This is NOT a planning command.
- DO NOT return markdown text or explanations.
- DO NOT create any files.
- DO NOT run any other slash commands.
- DO NOT examine or read any codebase files.
- Your ENTIRE response must be one of: `/chore`, `/bug`, `/feature`, or `0`
- Return ONLY the command, nothing else before or after it.

Example valid responses:
- `/feature`
- `/bug`
- `/chore`
- `0`