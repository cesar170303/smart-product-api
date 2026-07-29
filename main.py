class Product:
    def __init__(self, name: str, price: float, category:str ):
        self.name = name
        self.price = price
        self.category = category

    def __str__(self):
        return f"{self.name} , {self.price} y {self.category}"

