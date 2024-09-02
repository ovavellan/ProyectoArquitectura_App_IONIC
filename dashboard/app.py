from flask import Flask, jsonify, request
import mysql.connector
import matplotlib.pyplot as plt
import io
import base64
from flask_cors import CORS

app = Flask(__name__)

# Configuración de CORS
CORS(app)

# Conexión a la base de datos MySQL
def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="admin",
        database="aviacion_civil"
    )
    return connection

# KPI 1: Cantidad de pilotos por mes en un año específico
def get_kpi_pilots_by_month(year):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT MONTH(STR_TO_DATE(fecha_emis_licencia, '%Y-%m-%d')) AS mes_emision_licencia, 
               COUNT(*) AS cantidad_pilotos 
        FROM piloto_modelo 
        WHERE YEAR(STR_TO_DATE(fecha_emis_licencia, '%Y-%m-%d')) = %s 
        GROUP BY mes_emision_licencia 
        ORDER BY mes_emision_licencia
    """, (year,))
    data = cursor.fetchall()
    cursor.close()
    connection.close()
    return data

# KPI 2: Horas de vuelo acumuladas por mes y año
def get_kpi_flight_hours_by_month_year(year, month):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT nombre_aeronave, SUM(v.duracion_horas) AS total_horas_vuelo 
        FROM vuelos_modelo v 
        INNER JOIN avion_modelo a ON v.avion_id = a.id 
        WHERE YEAR(v.fecha_vuelo) = %s AND MONTH(v.fecha_vuelo) = %s 
        GROUP BY nombre_aeronave
    """, (year, month))
    data = cursor.fetchall()
    cursor.close()
    connection.close()
    return data

# KPI 3: Número total de vuelos por mes en un año específico
def get_kpi_total_flights_by_month(year):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT MONTH(fecha_vuelo) AS mes_vuelo, COUNT(*) AS total_vuelos 
        FROM vuelos_modelo 
        WHERE YEAR(fecha_vuelo) = %s 
        GROUP BY mes_vuelo 
        ORDER BY mes_vuelo
    """, (year,))
    data = cursor.fetchall()
    cursor.close()
    connection.close()
    return data

@app.route('/kpis', methods=['GET'])
def kpis():
    year = request.args.get('year', default=None, type=int)
    month = request.args.get('month', default=None, type=int)

    if year is None:
        return jsonify({'error': 'El parámetro year es obligatorio'}), 400

    kpis = {
        'pilots_by_month': get_kpi_pilots_by_month(year),
        'flight_hours_by_month_year': get_kpi_flight_hours_by_month_year(year, month) if month is not None else [],
        'total_flights_by_month': get_kpi_total_flights_by_month(year)
    }
    return jsonify(kpis)

@app.route('/graficos', methods=['GET'])
def graficos():
    year = request.args.get('year', default=None, type=int)
    month = request.args.get('month', default=None, type=int)

    if year is None:
        return jsonify({'error': 'El parámetro year es obligatorio'}), 400

    # Gráfico 1: Cantidad de pilotos por mes en un año específico (Gráfico de Pastel)
    pilots_by_month = get_kpi_pilots_by_month(year)
    months = [d[0] for d in pilots_by_month]
    quantities = [d[1] for d in pilots_by_month]

    # Convertir números de meses en nombres de meses
    month_names = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]
    month_labels = [month_names[m - 1] for m in months]

    plt.figure(figsize=(8, 8))
    plt.pie(quantities, labels=month_labels, autopct='%1.1f%%', colors=plt.get_cmap('tab20').colors)
    plt.title(f'Distribución de Pilotos por Mes en {year}')
    plt.tight_layout()

    img1 = io.BytesIO()
    plt.savefig(img1, format='png')
    img1.seek(0)
    plot_url1 = base64.b64encode(img1.getvalue()).decode()
    plt.close()

    # Gráfico 2: Horas de vuelo acumuladas por mes y año (Gráfico de Barras)
    flight_hours_by_month_year = get_kpi_flight_hours_by_month_year(year, month)
    aircrafts = [d[0] for d in flight_hours_by_month_year]
    hours = [d[1] for d in flight_hours_by_month_year]

    plt.figure(figsize=(10, 6))
    plt.bar(aircrafts, hours, color='green')
    plt.xlabel('Aeronave')
    plt.ylabel('Horas de Vuelo Acumuladas')
    plt.title(f'Horas de Vuelo Acumuladas en {month}/{year}')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    img2 = io.BytesIO()
    plt.savefig(img2, format='png')
    img2.seek(0)
    plot_url2 = base64.b64encode(img2.getvalue()).decode()
    plt.close()

    # Gráfico 3: Número total de vuelos por mes en un año específico (Gráfico de Líneas)
    total_flights_by_month = get_kpi_total_flights_by_month(year)
    months = [d[0] for d in total_flights_by_month]
    flights = [d[1] for d in total_flights_by_month]

    plt.figure(figsize=(10, 6))
    plt.plot(months, flights, marker='o', linestyle='-', color='orange')
    plt.xlabel('Mes')
    plt.ylabel('Número de Vuelos')
    plt.title(f'Número Total de Vuelos por Mes en {year}')
    plt.xticks(ticks=range(1, 13), labels=[
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ], rotation=45)
    plt.tight_layout()

    img3 = io.BytesIO()
    plt.savefig(img3, format='png')
    img3.seek(0)
    plot_url3 = base64.b64encode(img3.getvalue()).decode()
    plt.close()

    return jsonify({
        "plot_url1": plot_url1,
        "plot_url2": plot_url2,
        "plot_url3": plot_url3
    })

if __name__ == '__main__':
    app.run(debug=True)
