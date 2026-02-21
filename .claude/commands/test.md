# Application Validation Test Suite

Execute comprehensive validation tests for both frontend and backend components, returning results in a standardized JSON format for automated processing.

## Purpose

Proactively identify and fix issues in the application before they impact users or developers. By running this comprehensive test suite, you can:
- Detect syntax errors, type mismatches, and import failures
- Identify broken tests or security vulnerabilities
- Verify build processes and dependencies
- Ensure the application is in a healthy state

## Variables

TEST_COMMAND_TIMEOUT: 5 minutes

## Instructions

- Execute each test in the sequence provided below
- Capture the result (passed/failed) and any error messages
- IMPORTANT: Return ONLY the JSON array with test results
  - IMPORTANT: Do not include any additional text, explanations, or markdown formatting
  - We'll immediately run JSON.parse() on the output, so make sure it's valid JSON
- If a test passes, omit the error field
- If a test fails, include the error message in the error field
- Execute all tests even if some fail
- Error Handling:
  - If a command returns non-zero exit code, mark as failed and immediately stop processing tests
  - Capture stderr output for error field
  - Timeout commands after `TEST_COMMAND_TIMEOUT`
  - IMPORTANT: If a test fails, stop processing tests and return the results thus far
- Always run `pwd` and `cd` before each test to ensure you're operating in the correct directory for the given test

## Test Execution Sequence

### Backend Tests

1. **Python Syntax Check**
   - Command: `cd app/server && uv run python -m py_compile server.py`
   - test_name: "python_syntax_check"
   - test_purpose: "Validates Python syntax by compiling source files to bytecode"

2. **Backend Code Quality Check**
   - Command: `cd app/server && uv run ruff check .`
   - test_name: "backend_linting"
   - test_purpose: "Validates Python code quality, identifies unused imports, style violations, and potential bugs"

3. **All Backend Tests**
   - Command: `cd app/server && uv run pytest tests/ -v --tb=short`
   - test_name: "all_backend_tests"
   - test_purpose: "Validates all backend functionality"

### Frontend Tests

4. **Frontend Build**
   - Command: `cd app/client && npm run build`
   - test_name: "frontend_build"
   - test_purpose: "Validates the complete frontend build process including bundling and production compilation"

## Report

- IMPORTANT: Return results exclusively as a JSON array based on the `Output Structure` section below.
- Sort the JSON array with failed tests (passed: false) at the top
- Include all tests in the output, both passed and failed

### Output Structure

```json
[
  {
    "test_name": "string",
    "passed": boolean,
    "execution_command": "string",
    "test_purpose": "string",
    "error": "optional string"
  },
  ...
]
```
