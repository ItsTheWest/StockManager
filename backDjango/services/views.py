
#aqui hacemos web scraping para obtener el valor del dolar en el bcv en su pagina oficial
import requests # Importa la librería para hacer peticiones HTTP (descargar páginas web)
from bs4 import BeautifulSoup # Importa la librería para analizar y navegar por el HTML
from django.http import JsonResponse # Importa la función de Django para devolver respuestas en formato JSON

# Define la función principal (vista de Django) que se ejecuta al acceder a la URL 'api/dolar-bcv/'
def getBcv(request):
    # 'request' es un objeto que Django pasa automáticamente, conteniendo información sobre la petición entrante.
    
    # ----------------------------------------------------
    # 1. Configuración de la Petición
    # ----------------------------------------------------
    url = "https://www.bcv.org.ve/" # Define la URL de la página web a la que vamos a acceder.
    
    # Crea un diccionario con encabezados (headers) para simular ser un navegador real.
    # El BCV puede bloquear peticiones que parezcan automatizadas si no tienen este "identificador".
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    # ----------------------------------------------------
    # 2. Bloque de Manejo de Errores (try...except)
    # ----------------------------------------------------
    # El bloque 'try' intenta ejecutar el código que puede fallar (ej. problemas de red, página caída).
    try:
        # Petición HTTP a la URL:
        response = requests.get(
            url, 
            headers=headers, 
            verify=False, # Instruye a 'requests' a no validar el certificado SSL del sitio (común en el BCV).
            timeout=10    # Define un tiempo máximo de espera de 10 segundos para la respuesta.
        )
        
        # ----------------------------------------------------
        # 3. Primer Condicional: ¿La petición fue exitosa?
        # ----------------------------------------------------
        # Condición: Si el código de estado HTTP es 200 (OK).
        if response.status_code == 200:
            # Crea un objeto 'BeautifulSoup' para analizar el contenido HTML.
            soup = BeautifulSoup(response.content, "html.parser") 
            
            # ----------------------------------------------------
            # 4. Extracción de Datos Específicos
            # ----------------------------------------------------
            # Busca el elemento HTML específico (un 'div') que tiene el id="dolar".
            dolar_div = soup.find("div", {"id": "dolar"})
            
            # Segundo Condicional: ¿Se encontró el elemento del dólar en el HTML?
            if dolar_div:
                # Busca la etiqueta 'strong' dentro del div del dólar.
                # Extrae el texto, y '.strip()' elimina espacios en blanco sobrantes.
                rate_text = dolar_div.find("strong").text.strip()
                
                # Reemplaza la coma (separador decimal usado en Venezuela) por un punto.
                # Esto es necesario para que el valor sea un número decimal válido en Python/JavaScript.
                rate_value = rate_text.replace(',', '.')
                
                # ----------------------------------------------------
                # 5. Respuesta Exitosa (JSON)
                # ----------------------------------------------------
                # Devuelve una respuesta JSON al frontend. Esta es la respuesta final.
                return JsonResponse({
                    "process": True, # Indica al frontend que el proceso fue exitoso.
                    "value": float(rate_value), # Convierte el string a número decimal (float) antes de enviarlo.
                    "name": "BCV"
                })
            
            # ----------------------------------------------------
            # 6. Respuesta de Error (No se encontró el elemento)
            # ----------------------------------------------------
            # Si el condicional 'if dolar_div:' falla (no se encontró el ID 'dolar'):
            return JsonResponse({
                "process": False, 
                "error": "No se encontró el elemento"
            }, status=500) # Devuelve un error interno del servidor (500)
            
        # Si el condicional 'if response.status_code == 200:' falla:
        # Este código maneja otros códigos HTTP (ej. 404 No encontrado, 503 Servicio no disponible).
        return JsonResponse({
            "process": False, 
            "error": f"Error HTTP: La página respondió con el código {response.status_code}"
        }, status=response.status_code)


    # ----------------------------------------------------
    # 7. Manejo de Excepciones
    # ----------------------------------------------------
    # El bloque 'except' se ejecuta si ocurre cualquier error no controlado dentro del 'try' 
    # (ej. TimeOut, problema de DNS, error de red).
    except Exception as e:
        # Devuelve una respuesta de error al frontend con la descripción del fallo.
        return JsonResponse({
            "process": False, 
            "error": str(e) # Convierte el objeto de error a un string legible.
        }, status=500) # Devuelve un error interno del servidor (500).          # Aquí es donde el B