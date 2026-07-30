from fastapi import HTTPException, Depends, APIRouter
from models.models import ProductModel
from sqlmodel import Session, select
from core.database import engine, get_session
from services.ai_services import get_ai_category


routers = APIRouter()

@routers.get("/products")
def products(session: Session = Depends(get_session)):
    """ 1. Construimos la pregunta select(ProductModel)
    Dame toda la información de la tabla ProductModel.
    2. Ejecutamos la pregunta contra la base de datos
    .session.exec() envía la orden a Postgres.
    .all() le dice: Tráeme todos los resultados de golpe en una lista de Python
    """
    statment = select(ProductModel)

    results = session.exec(statment).all()

    return results




@routers.post("/add_products")
def add_products(new_product: ProductModel, session: Session = Depends(get_session)):
    
    #actual_list = datapersistence.load_products()

    category_ai = get_ai_category(new_product.name)
    new_product.category = category_ai
    new_product.apply_pricing_rules()

    session.add(new_product)
    session.commit()
    session.refresh(new_product)

    return {"mensaje": "Producto añadido correctamente", "Producto" : new_product}



@routers.delete("/delete_product/{product_name}")
def delete_products(product_name : str, session: Session = Depends(get_session)):

    statment = select(ProductModel).where(ProductModel.name == product_name)
    product_found = session.exec(statment).first()

    if product_found is None:
            raise HTTPException(status_code=404, detail="Product not found")
    
    session.delete(product_found)
    session.commit()

    return {"mensaje": f"El producto {product_name} ha sido eliminado correctamente"}




@routers.put("/update_product/{product_name}")
def update_product(product : ProductModel, product_name : str, session: Session = Depends(get_session)):

    statment = select(ProductModel).where(ProductModel.name == product_name)
    product_found = session.exec(statment).first()

    if product_found is None:
        #Importante el raise si no crea el objeto del error lo lee y sigue ejecutado hacia abajo
        raise HTTPException(status_code=404, detail="Product not found")

    #Modificamos los valores con lo que nos llega del cliente
    product_found.name = product.name
    product_found.price = product.price
    product_found.category = product.category

    product_found.apply_pricing_rules()

    session.commit()
    session.refresh(product_found)

    return {"mensaje": f"El producto {product_name} ha sido actualizado correctamente", "Producto": product_found} 
