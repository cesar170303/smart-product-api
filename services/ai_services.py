from dotenv import load_dotenv
import os
from google import genai

load_dotenv()

client = genai.Client()


def get_ai_category(product_name: str) -> str:
    print(f"Analizando el producto {product_name}")

    prompt = f"""
            Persona: Eres un calificador de productos de gran experiencia con 15 años.
            Contexto: Necesitamos indicar una categoria para el producto.
            Tarea: Clasifica el producto y devolvemos una palabra solamente, el producto a calificar es {product_name}.
            Ejemplo y restricciones: Solo necesitamos UNA palabra que sera la CATEGORIA ,ejemplo:Lácteos, Limpieza, Fruta, Tecnolgia, etc. No queremos
            que sea una frase nada de eso solo UNA palabra.
        """

    response = client.interactions.create(
        model = "gemini-3.5-flash",
        input = prompt
    )
    
    
    return response.output_text.strip()

