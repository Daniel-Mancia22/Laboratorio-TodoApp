# 📝 TODO App - Sistema de Gestión de Tareas

## Descripción
Sistema completo de gestión de tareas desarrollado con Docker, Node.js, PostgreSQL y Nginx. Permite crear, leer, actualizar y eliminar tareas de manera eficiente.

## 🏗️ Arquitectura
El sistema sigue una arquitectura de tres capas:
- **Frontend**: Servidor Nginx que sirve archivos estáticos (HTML, CSS, JS)
- **Backend**: API REST desarrollada con Node.js y Express
- **Base de Datos**: PostgreSQL para persistencia de datos

Cliente → Nginx (Puerto 8080) → Backend Node.js (Puerto 3000) → PostgreSQL (Puerto 5432)

## 🛠️ Tecnologías

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Servidor Web**: Nginx
- **Base de Datos**: PostgreSQL 15
- **Orquestación**: Docker + Docker Compose
- **Control de Versiones**: Git
