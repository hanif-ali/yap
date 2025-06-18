ACCEPTED_PROVIDERS = ["google", "mistralai", "meta", "openai", "anthropic", "x-ai"]

def convert_open_router_object_to_model_definition(data: dict) -> dict:
    model_def = {
        "provider": data["author"],
        "key": data["slug"],
        "name": data["name"],
        "shortName": data["short_name"],
        "description": data["description"],
        "inputCapabilities": data["input_modalities"],
        "enabled": True,
        "byok": True,
    }
    endpoint = data.get("endpoint") or {}
    reasoning = endpoint.get("supports_reasoning", False)
    tools = endpoint.get("supports_tool_parameters", False)
    model_def["reasoning"] = bool(reasoning)
    model_def["tools"] = bool(tools)

    # Mistral models require differnt format of tool ids, so we just disable tools entirely for them
    if model_def["key"].startswith("mistral"):
        model_def["tools"] = False

    return model_def


def convert_open_router_data_to_model_definition(models: list[dict]) -> list[dict]:
    keys = []
    model_defs = []
    # Some models have the same slug, so we need to remove duplicates
    for model in models:
        if model["slug"] in keys or model["author"] not in ACCEPTED_PROVIDERS:
            continue
        model_defs.append(convert_open_router_object_to_model_definition(model))
        keys.append(model["slug"])
    return model_defs