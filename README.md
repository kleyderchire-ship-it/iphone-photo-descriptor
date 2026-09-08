# 📱 iPhone Photo Descriptor

Una aplicación web que analiza fotos y genera descripciones detalladas tipo "Raw iPhone snapshot" usando Google Cloud Vision API.

## ✨ Características

- ✅ Interfaz intuitiva con drag & drop
- ✅ Análisis de imágenes con Google Cloud Vision
- ✅ Descripciones detalladas y profesionales
- ✅ 100% gratuito (hasta 1,000 requests/mes)
- ✅ Hospedable en Vercel sin costo
- ✅ Responsive y rápido

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 + Vite
- **Backend**: Node.js + Express
- **IA**: Google Cloud Vision API
- **Hosting**: Vercel (gratuito)

## 📋 Requisitos previos

1. Node.js 16+ instalado
2. Cuenta de Google Cloud Platform
3. Cuenta de Vercel (para deploy)

## 🚀 Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/kleyderchire-ship-it/iphone-photo-descriptor.git
cd iphone-photo-descriptor
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Google Cloud Vision

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Activa la API "Cloud Vision"
4. Ve a "Credenciales" y crea una "Service Account"
5. Descarga el JSON de credenciales
6. Renómbralo a `google-credentials.json` y ponlo en la raíz del proyecto

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y asegúrate que `GOOGLE_APPLICATION_CREDENTIALS` apunte a tu archivo de credenciales.

### 5. Ejecutar en desarrollo

En una terminal:
```bash
npm run dev
```

En otra terminal:
```bash
npm run server
```

Luego abre http://localhost:5173 en tu navegador.

## 📦 Build para producción

```bash
npm run build
```

## 🌐 Deploy en Vercel

### Opción 1: Deploy manual

```bash
npm install -g vercel
vercel
```

### Opción 2: Deploy desde GitHub

1. Pushea tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Conecta tu repositorio de GitHub
4. Configura la variable de entorno `GOOGLE_APPLICATION_CREDENTIALS` en Vercel
5. Deploy automático

**IMPORTANTE**: Para Vercel, necesitas:
- Convertir el contenido de `google-credentials.json` a una variable de entorno
- O usar un servicio como Firebase para almacenar credenciales

## 💡 Cómo usar

1. Carga una foto haciendo clic o arrastrándola
2. Haz clic en "Analizar foto"
3. Espera mientras se procesa con Google Cloud Vision
4. Recibe una descripción detallada tipo "Raw iPhone snapshot"
5. Copia la descripción si lo necesitas

## 📊 Límites gratuitos

- **Google Cloud Vision**: 1,000 requests/mes gratis
- Después: $1.50 USD por 1,000 requests
- **Vercel**: 100GB bandwidth gratis/mes

## 🔧 Estructura del proyecto

```
iphone-photo-descriptor/
├── src/
│   ├── App.vue          # Componente principal
│   └── main.js          # Entrada de Vue
├── server.js            # Backend con Express
├── vite.config.js       # Config de Vite
├── package.json         # Dependencias
├── .env.example         # Variables de entorno
└── README.md            # Este archivo
```

## 🐛 Troubleshooting

**Error: "Google Cloud credentials not found"**
- Verifica que `google-credentials.json` esté en la raíz
- Revisa que la ruta en `.env` sea correcta

**Error: "CORS issues"**
- Asegúrate que el backend está corriendo en puerto 3001
- Verifica la configuración de CORS en `server.js`

**Error: "Image too large"**
- Las imágenes deben ser menores a 20MB
- Google Cloud Vision tiene este límite

## 📝 Personalización

Puedes personalizar:
- El prompt en `server.js` función `generateDescription()`
- Los estilos en `src/App.vue`
- Las plantillas de descripción en el backend

## 📄 Licencia

MIT

## 👨‍💻 Autor

kleyderchire-ship-it

---

**¿Preguntas?** Abre un issue en el repositorio o contáctame.