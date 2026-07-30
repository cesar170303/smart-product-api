def get_ai_category(product_name:str) -> str:
    print(f"Analizando el producto {product_name}")

    lower_name = product_name.lower()
    if "mancuerna" in lower_name or "bici" in lower_name:
        return "Deporte"
    elif "movil" in lower_name or "tablet" in lower_name:
        return "Tecnologia"
    else:
        return "General"