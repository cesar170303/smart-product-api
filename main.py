import json
from pathlib import Path


class Product:
    def __init__(self, name: str, price: float, category:str ):
        self.name = name
        self.price = price
        self.category = category

    def __str__(self):
        return f"{self.name} , {self.price} y {self.category}"

class DataPersistence:
    def __init__(self, file_path=None):
        if file_path is None:
            self.file_path = str(Path(__file__).resolve().parent / "products.json")
        else:
            self.file_path = file_path
        

    def load_products(self ):
        try:
            with open(self.file_path, "r", encoding="utf-8") as file:
                return json.load(file)
        except json.JSONDecodeError:
            return []
        except FileNotFoundError:
            return []
        

    def save_product(self, products_list:list):
        #products = [product.__dict__ for product in products_list]
        with open(self.file_path, "w", encoding="utf-8") as file:
            json.dump(products_list, file, indent=4, ensure_ascii = False)

        

"""products = [
    Product("Movil", 200),
    Product("Tablet", 40),
    Product("Ordenador", 600, "Tecnologia")
]

products.append(Product("Lapiz", 1))
gestor_datos = DataPersistence()

gestor_datos.save_product(products)
productos_recuperados = gestor_datos.load_products()"""



"""for i in producto_recuperados:
    print(i)"""