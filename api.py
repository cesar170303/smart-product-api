from fastapi import FastAPI, HTTPException
from main import DataPersistence
from models import ProductModel


app = FastAPI()
datapersistence = DataPersistence()



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

    new_product.apply_pricing_rules()

    dict_product = new_product.model_dump()
    actual_list.append(dict_product)

    datapersistence.save_product(actual_list)
    return {"mensaje": "Producto añadido correctamente", "Producto" : new_product}



@app.delete("/delete_product/{product_name}")
def delete_products(product_name : str):

    actual_list = datapersistence.load_products()

    # Creamos la nueva lista comparando sin importar mayúsculas
    new_list = [x for x in actual_list if x["name"].casefold() != product_name.casefold()]

    # Si miden lo mismo, el producto no estaba en la base de datos
    if len(actual_list) == len(new_list):
        raise HTTPException(status_code=404, detail="Product not found")

    # Guardamos la lista nueva y devolvemos el éxito
    datapersistence.save_product(new_list)
    return {"mensaje": f"El producto {product_name} ha sido eliminado correctamente"}



@app.put("/update_product/{product_name}")
def update_product(product : ProductModel, product_name : str):

    actual_list = datapersistence.load_products()
    product_found = False

    for i, current_product in enumerate(actual_list):
        if current_product["name"].casefold() == product_name.casefold():

            #Si no ponemos categoria en el update cogemos la actual y despues llamamos funcion del precio.
            product.category = current_product["category"]

            product.apply_pricing_rules()

            dict_product = product.model_dump()
            actual_list[i] = dict_product

            product_found = True
            break

    if not product_found:
        #Importante el raise si no crea el objeto del error lo lee y sigue ejecutado hacia abajo
        raise HTTPException(status_code=404, detail="Product not found")

    # Guardamos la lista completa y actualizada
    datapersistence.save_product(actual_list)
    return {"mensaje": f"El producto {product_name} ha sido actualizado correctamente"}