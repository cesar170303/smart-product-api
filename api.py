from fastapi import FastAPI
from main import DataPersistence
from pydantic import BaseModel
from pricing import PRICING_CALCULATORS, PricingStrategy

app = FastAPI()
datapersistence = DataPersistence()

class ProductModel(BaseModel):
    name:str
    price: float
    category:str = "Pendiente de IA"

@app.get("/products")
def products():

    return datapersistence.load_products()

def get_ai_category(product_name:str) -> str:
    print(f"Analizando el producto {product_name}")

    lower_name = product_name.lower()
    if "mancuerna" in lower_name or "bici" in lower_name:
        return "Deporte"
    elif "movil" in lower_name or "tablet" in lower_name:
        return "Tecnologia"
    else:
        return "General"



@app.post("/add_products")
def add_products(new_product: ProductModel):
    
    actual_list = datapersistence.load_products()

    category_ai = get_ai_category(new_product.name)
    new_product.category = category_ai

    calculador = PRICING_CALCULATORS.get(new_product.category, PricingStrategy())
    new_product.price = calculador.calculate_final_price(new_product.price)

    dict_product = new_product.model_dump()
    actual_list.append(dict_product)

    datapersistence.save_product(actual_list)
    return {"mensaje": "Producto añadido correctamente", "Producto" : new_product}