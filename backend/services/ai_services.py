import logging

from google import genai


logger = logging.getLogger(__name__)

# Categoría que se usa cuando Gemini falla o no devuelve nada aprovechable.
# No está en PRICING_CALCULATORS, así que el motor de precios aplica StandardPricing.
DEFAULT_CATEGORY = "General"

# Segundos máximos de espera a Gemini antes de rendirnos y usar la categoría por defecto.
GEMINI_TIMEOUT_SECONDS = 10

# Caracteres que el modelo suele añadir alrededor de la palabra (markdown, puntuación, comillas).
NOISE_CHARS = " \t\n.,;:!?¡¿*_`\"'()[]{}"

#No hace falta que le pase la Api key la recoge automaticamente
client = genai.Client()


def _clean_category(raw_text: str | None) -> str | None:
    """Se queda con una sola palabra de la respuesta del modelo, o None si no hay nada útil."""
    if not raw_text:
        return None

    # Si el modelo responde "Categoría: Limpieza", lo útil va detrás de los dos puntos.
    text = raw_text.split(":")[-1]

    for word in text.split():
        cleaned = word.strip(NOISE_CHARS)
        if cleaned.isalpha():
            return cleaned.capitalize()

    return None


def get_ai_category(product_name: str) -> str:
    logger.info("Pidiendo categoría a la IA para el producto %r", product_name)

    prompt = f"""
            Persona: Eres un clasificador de productos con 15 años de experiencia.
            Contexto: Necesitamos indicar una categoría para el producto.
            Tarea: Clasifica el producto y devuelve una palabra solamente, el producto a clasificar es {product_name}.
            Ejemplo y restricciones: Solo necesitamos UNA palabra que será la CATEGORÍA, ejemplo: Lácteos, Limpieza, Fruta, Tecnología, etc.
            No queremos una frase, ni puntuación, ni formato: solo UNA palabra.
        """

    try:
        #Ejecutamos una llamada a la nueva API de interacciones de Gemini
        response = client.interactions.create(
            model = "gemini-3.5-flash",
            input = prompt,
            timeout = GEMINI_TIMEOUT_SECONDS,
        )
        raw_text = response.output_text
    except Exception:
        # La IA es un extra: si falla, el producto se guarda igual con la categoría por defecto.
        logger.exception("La IA falló al clasificar %r; se usa %r", product_name, DEFAULT_CATEGORY)
        return DEFAULT_CATEGORY

    category = _clean_category(raw_text)
    if category is None:
        logger.warning("Respuesta de la IA no aprovechable para %r: %r", product_name, raw_text)
        return DEFAULT_CATEGORY

    return category
