# Smart Product App - Backend API
> Desarrollado por César Martínez

API RESTful construida con **FastAPI** para gestionar el inventario de una tienda inteligente. El sistema categoriza productos simulando decisiones de Inteligencia Artificial y aplica reglas de negocio para calcular precios dinámicos.

**Stack Tecnológico:** `Python 3` | `FastAPI` | `Pydantic` | `POO` | `SOLID`

---

## 🚀 Características Principales

* **Categorización Automática (Mock IA):** Asigna categorías a los productos basándose en palabras clave del nombre.
* **Motor de Precios Dinámico:** Calcula impuestos o descuentos dependiendo de la categoría del producto (ej. +21% IVA para tecnología).
* **Validación Estricta:** Uso de Pydantic Models (DTOs) para asegurar la integridad de los datos de entrada.
* **Persistencia de Datos Defensiva:** Almacenamiento local con mecanismos de *Defensive Programming* (`try/except`) para prevenir caídas del servidor por archivos corruptos o ausentes.

---

## 🏗️ Arquitectura y Principios de Diseño

El código está modularizado para garantizar la mantenibilidad y escalabilidad, aplicando patrones de diseño profesionales:

* **Open/Closed Principle (OCP):** El cálculo de precios está aislado en el módulo `pricing.py` utilizando herencia de clases (Estrategia). En lugar de usar cadenas de `if/else`, la API utiliza un **diccionario estratégico** y el método `.get()`. Esto permite añadir nuevas reglas de negocio sin modificar el código existente de los *endpoints*.
* **Separación de Responsabilidades:** Los módulos están claramente divididos en enrutamiento (`api.py`), persistencia (`main.py`) y lógica de negocio (`pricing.py`).

> 💡 **Nota sobre la Base de Datos:** 
> Actualmente, la persistencia se realiza en un archivo JSON (`products.json`) para facilitar el desarrollo temprano y el prototipado rápido. En futuras iteraciones, esta infraestructura de datos migrará a un sistema de base de datos relacional gratuito en la nube.

---

## ⚙️ Instalación y Uso

1. Clona este repositorio y navega a la carpeta del proyecto.
2. Instala las dependencias necesarias:
   ```bash
   pip install fastapi uvicorn pydantic

3. Inicia el servidor de desarrollo:
   ```bash
   uvicorn api:app --reload