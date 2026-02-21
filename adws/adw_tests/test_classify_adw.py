#!/usr/bin/env python3
"""Test classify_adw JSON parsing and fallback extraction.

Tests the parse_json utility and _fallback_extract_adw_info function
to validate classify_adw returns valid JSON and handles edge cases.

Run: python adws/adw_tests/test_classify_adw.py
"""

import json
import re
import sys


# ── Inline copies of the functions under test ──────────────────────────
# We inline these to avoid importing the full adw_modules tree (which
# requires pydantic and other deps that aren't available in this context).

AVAILABLE_ADW_WORKFLOWS = [
    "adw_plan_iso",
    "adw_patch_iso",
    "adw_build_iso",
    "adw_test_iso",
    "adw_review_iso",
    "adw_document_iso",
    "adw_ship_iso",
    "adw_sdlc_ZTE_iso",
    "adw_plan_build_iso",
    "adw_plan_build_test_iso",
    "adw_plan_build_test_review_iso",
    "adw_plan_build_document_iso",
    "adw_plan_build_review_iso",
    "adw_sdlc_iso",
]


def parse_json(text, target_type=None):
    """Copy of adw_modules.utils.parse_json for standalone testing."""
    code_block_pattern = r'```(?:json)?\s*\n(.*?)\n```'
    match = re.search(code_block_pattern, text, re.DOTALL)

    if match:
        json_str = match.group(1).strip()
    else:
        json_str = text.strip()

    if not (json_str.startswith('[') or json_str.startswith('{')):
        array_start = json_str.find('[')
        array_end = json_str.rfind(']')
        obj_start = json_str.find('{')
        obj_end = json_str.rfind('}')

        if array_start != -1 and (obj_start == -1 or array_start < obj_start):
            if array_end != -1:
                json_str = json_str[array_start:array_end + 1]
        elif obj_start != -1:
            if obj_end != -1:
                json_str = json_str[obj_start:obj_end + 1]

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}. Text was: {json_str[:200]}...")


def fallback_extract_adw_info(text):
    """Copy of adw_modules.workflow_ops._fallback_extract_adw_info for standalone testing.
    Returns a dict with workflow_command, adw_id, model_set."""
    adw_command = None
    for workflow in AVAILABLE_ADW_WORKFLOWS:
        if workflow in text or f"/{workflow}" in text:
            adw_command = workflow
            break

    if not adw_command:
        command_match = re.search(
            r"(?:/?)adw_(\w+?)(?:_iso)?(?:\s|$|\")", text, re.IGNORECASE
        )
        if command_match:
            candidate = f"adw_{command_match.group(1)}_iso"
            if candidate in AVAILABLE_ADW_WORKFLOWS:
                adw_command = candidate

    adw_id = None
    id_match = re.search(r"\b([a-f0-9]{8})\b", text)
    if id_match:
        adw_id = id_match.group(1)

    model_set = "base"
    if re.search(r"model[_\s]?set[:\s]*heavy", text, re.IGNORECASE):
        model_set = "heavy"

    return {
        "workflow_command": adw_command,
        "adw_id": adw_id,
        "model_set": model_set,
    }


# ── Tests ──────────────────────────────────────────────────────────────

def test_parse_json_valid_responses():
    """Test parse_json with valid classify_adw JSON responses."""
    print("Testing parse_json with valid classify_adw responses...")

    # Raw JSON object
    raw = '{"adw_slash_command": "/adw_sdlc_iso", "adw_id": "a1b2c3d4", "model_set": "base"}'
    result = parse_json(raw, dict)
    assert result["adw_slash_command"] == "/adw_sdlc_iso", f"Expected /adw_sdlc_iso, got {result['adw_slash_command']}"
    assert result["adw_id"] == "a1b2c3d4"
    assert result["model_set"] == "base"
    print("  raw JSON object")

    # JSON in markdown code block
    markdown = '```json\n{"adw_slash_command": "/adw_plan_build_iso", "model_set": "heavy"}\n```'
    result = parse_json(markdown, dict)
    assert result["adw_slash_command"] == "/adw_plan_build_iso"
    assert result["model_set"] == "heavy"
    print("  JSON in markdown code block")

    # Empty JSON object
    result = parse_json("{}", dict)
    assert result == {}
    print("  empty JSON object")

    # JSON with extra whitespace
    result = parse_json('  \n  {"adw_slash_command": "/adw_test_iso"}  \n  ', dict)
    assert result["adw_slash_command"] == "/adw_test_iso"
    print("  JSON with extra whitespace")

    print("PASS: All valid response tests passed")


def test_parse_json_rejects_file_paths():
    """Test that parse_json raises ValueError for file path responses (the actual bug)."""
    print("Testing parse_json rejects file paths (the reported bug)...")

    file_paths = [
        "specs/issue-9-adw-base-sdlc_planner-dashboard-fleet-overview.md",
        "specs/issue-12-adw-a1b2c3d4-sdlc_planner-add-auth.md",
        "`specs/issue-9-adw-base-sdlc_planner-dashboard-fleet-overview.md`",
    ]

    for path in file_paths:
        try:
            parse_json(path, dict)
            print(f"  FAIL: Should have raised ValueError for: {path}")
            return False
        except ValueError:
            print(f"  correctly rejects: {path[:60]}...")

    print("PASS: All file path rejection tests passed")
    return True


def test_parse_json_rejects_plain_text():
    """Test that parse_json raises ValueError for non-JSON responses."""
    print("Testing parse_json rejects plain text...")

    texts = [
        "I found the workflow command /adw_sdlc_iso in the text.",
        "",
        "The answer is 42",
    ]

    for text in texts:
        try:
            parse_json(text, dict)
            print(f"  FAIL: Should have raised ValueError for: '{text[:50]}'")
            return False
        except ValueError:
            label = text[:50] if text else "(empty string)"
            print(f"  correctly rejects: {label}")

    print("PASS: All plain text rejection tests passed")
    return True


def test_fallback_extract_known_workflows():
    """Test fallback_extract_adw_info recovers info from non-JSON text."""
    print("Testing fallback extraction from non-JSON text...")

    # File path without recognizable workflow command
    result = fallback_extract_adw_info(
        "specs/issue-9-adw-base-sdlc_planner-dashboard-fleet-overview.md"
    )
    assert result["workflow_command"] is None, f"Expected None, got {result['workflow_command']}"
    print("  file path without workflow returns empty result")

    # Text mentioning a workflow command
    result = fallback_extract_adw_info("The workflow is adw_sdlc_iso for issue a1b2c3d4")
    assert result["workflow_command"] == "adw_sdlc_iso", f"Expected adw_sdlc_iso, got {result['workflow_command']}"
    assert result["adw_id"] == "a1b2c3d4", f"Expected a1b2c3d4, got {result['adw_id']}"
    assert result["model_set"] == "base"
    print("  text with workflow and adw_id extracted correctly")

    # Text mentioning workflow with slash prefix
    result = fallback_extract_adw_info("/adw_plan_build_iso model_set heavy")
    assert result["workflow_command"] == "adw_plan_build_iso"
    assert result["model_set"] == "heavy"
    print("  slash-prefixed workflow with heavy model_set extracted")

    # Text mentioning workflow without _iso suffix
    result = fallback_extract_adw_info("Run adw_plan_build for this issue")
    assert result["workflow_command"] == "adw_plan_build_iso", f"Expected adw_plan_build_iso, got {result['workflow_command']}"
    print("  workflow without _iso suffix mapped correctly")

    # Empty text
    result = fallback_extract_adw_info("")
    assert result["workflow_command"] is None
    print("  empty text returns empty result")

    print("PASS: All fallback extraction tests passed")


def test_fallback_model_set_detection():
    """Test model_set detection in fallback extraction."""
    print("Testing model_set detection in fallback...")

    result = fallback_extract_adw_info("adw_sdlc_iso model_set heavy")
    assert result["model_set"] == "heavy", f"Expected heavy, got {result['model_set']}"
    print("  'model_set heavy' detected")

    result = fallback_extract_adw_info("adw_sdlc_iso modelset heavy")
    assert result["model_set"] == "heavy"
    print("  'modelset heavy' detected")

    result = fallback_extract_adw_info("adw_sdlc_iso model set: heavy")
    assert result["model_set"] == "heavy"
    print("  'model set: heavy' detected")

    result = fallback_extract_adw_info("adw_sdlc_iso")
    assert result["model_set"] == "base"
    print("  defaults to 'base' when not specified")

    print("PASS: All model_set detection tests passed")


def test_end_to_end_classify_flow():
    """Simulate the full classify_adw flow: parse JSON, fall back if needed."""
    print("Testing end-to-end classify flow simulation...")

    # Simulate: AI returns valid JSON (happy path)
    ai_response = '{"adw_slash_command": "/adw_sdlc_iso", "adw_id": "abcd1234", "model_set": "base"}'
    data = parse_json(ai_response, dict)
    command = data.get("adw_slash_command", "").replace("/", "")
    assert command == "adw_sdlc_iso"
    assert command in AVAILABLE_ADW_WORKFLOWS
    print("  happy path: valid JSON parsed correctly")

    # Simulate: AI returns file path (the bug) -> parse_json fails -> fallback
    ai_response = "specs/issue-9-adw-base-sdlc_planner-dashboard-fleet-overview.md"
    try:
        parse_json(ai_response, dict)
        assert False, "Should have raised ValueError"
    except ValueError:
        fallback = fallback_extract_adw_info(ai_response)
        # This specific file path doesn't contain a workflow name, so fallback is empty
        assert fallback["workflow_command"] is None
        print("  bug case: file path fails parse, fallback returns empty (correct)")

    # Simulate: AI returns text with workflow name -> parse_json fails -> fallback recovers
    ai_response = "Running adw_plan_build_iso with adw_id a1b2c3d4 model_set heavy"
    try:
        parse_json(ai_response, dict)
        assert False, "Should have raised ValueError"
    except ValueError:
        fallback = fallback_extract_adw_info(ai_response)
        assert fallback["workflow_command"] == "adw_plan_build_iso"
        assert fallback["adw_id"] == "a1b2c3d4"
        assert fallback["model_set"] == "heavy"
        print("  text case: fallback recovers workflow, id, and model_set")

    print("PASS: All end-to-end flow tests passed")


def main():
    """Run all classify_adw tests."""
    print("=" * 60)
    print("classify_adw JSON Parsing & Fallback Tests")
    print("=" * 60)

    tests = [
        test_parse_json_valid_responses,
        test_parse_json_rejects_file_paths,
        test_parse_json_rejects_plain_text,
        test_fallback_extract_known_workflows,
        test_fallback_model_set_detection,
        test_end_to_end_classify_flow,
    ]

    passed = 0
    failed = 0

    for test in tests:
        print()
        try:
            result = test()
            if result is False:
                failed += 1
            else:
                passed += 1
        except Exception as e:
            print(f"  FAIL: {e}")
            failed += 1

    print()
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
