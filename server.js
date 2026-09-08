import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import vision from '@google-cloud/vision'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

// Inicializar cliente de Google Cloud Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json'
})

// Función para generar descripción tipo "Raw iPhone snapshot"
function generateDescription(annotations) {
  const {
    labelAnnotations = [],
    objectAnnotations = [],
    faceAnnotations = [],
    textAnnotations = [],
    imageProperties = {}
  } = annotations

  let description = 'Raw iPhone snapshot. '

  // Detectar si hay personas
  if (faceAnnotations && faceAnnotations.length > 0) {
    description += `Subject captured in ${faceAnnotations.length} ${faceAnnotations.length === 1 ? 'frame' : 'frames'}. `
  }

  // Descripción de objetos principales
  if (objectAnnotations && objectAnnotations.length > 0) {
    const mainObjects = objectAnnotations.slice(0, 3).map(obj => obj.name).join(', ')
    description += `Scene includes ${mainObjects}. `
  }

  // Colores dominantes
  if (imageProperties.dominantColors && imageProperties.dominantColors.colors) {
    const colors = imageProperties.dominantColors.colors
      .slice(0, 2)
      .map(c => getColorName(c.color))
      .filter(c => c)
    if (colors.length > 0) {
      description += `Color palette features ${colors.join(' and ')} tones. `
    }
  }

  // Etiquetas generales
  if (labelAnnotations && labelAnnotations.length > 0) {
    const labels = labelAnnotations.slice(0, 3).map(l => l.description).join(', ')
    description += `Characterized by ${labels}. `
  }

  // Información sobre iluminación
  description += `Natural lighting with balanced exposure and subtle details. `

  // Composición final
  description += `Composition maintains authentic iPhone photography aesthetic with Smart HDR processing. Professional-grade image quality with preserved natural detail and texture.`

  return description
}

// Función auxiliar para obtener nombre de color
function getColorName(rgb) {
  const r = rgb.red || 0
  const g = rgb.green || 0
  const b = rgb.blue || 0

  if (r > 150 && g < 100 && b < 100) return 'warm red'
  if (b > 150 && r < 100 && g < 100) return 'cool blue'
  if (g > 150 && r < 100 && b < 100) return 'vibrant green'
  if (r > 150 && g > 150 && b < 100) return 'golden yellow'
  if (r > 150 && g < 100 && b > 150) return 'deep purple'

  return null
}

// Endpoint para analizar imágenes
app.post('/analyze', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    // Convertir base64 a Buffer
    const imageBuffer = Buffer.from(image, 'base64')

    // Crear request para Vision API
    const request = {
      image: { content: imageBuffer },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
        { type: 'FACE_DETECTION' },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'TEXT_DETECTION' }
      ]
    }

    // Llamar a Google Cloud Vision
    const [result] = await client.annotateImage(request)

    // Generar descripción
    const description = generateDescription(result)

    res.json({ description })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      error: 'Error al procesar la imagen',
      details: error.message
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
})