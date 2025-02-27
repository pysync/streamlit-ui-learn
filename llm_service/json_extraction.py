import json

def extract_json(text):
    """
    Extracts valid JSON from a string.

    Args:
        text (str): The string potentially containing JSON.

    Returns:
        dict or list or None: The extracted JSON object, or None if no valid JSON is found.
    """
    try:
        # Try to load the entire text as JSON first
        return json.loads(text)
    except json.JSONDecodeError as e:
        # If that fails, try to find JSON within the text
        start = text.find('[')
        if start == -1:
            start = text.find('{')  # Check for object
        if start == -1:
            return None  # No JSON start found

        end = text.rfind(']')
        if end == -1:
            end = text.rfind('}')  # Check for object
        if end == -1:
            return None  # No JSON end found

        if start >= end:
          return None # Invalid start/end

        json_string = text[start:end + 1]
        try:
            return json.loads(json_string)
        except json.JSONDecodeError:
            return None  # Still couldn't parse the extracted part
    except Exception as e:
        print(f"Unexpected error during JSON extraction: {e}")
        return None  # Handle unexpected errors