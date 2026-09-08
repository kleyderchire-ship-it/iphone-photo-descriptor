<template>
  <div class="container">
    <div class="card">
      <h1>📱 iPhone Photo Descriptor</h1>
      <p class="subtitle">Analiza fotos y obtén descripciones tipo "Raw iPhone snapshot"</p>
      
      <!-- Zona de carga -->
      <div 
        class="upload-zone"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="{ dragging: isDragging }"
      >
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect" 
          accept="image/*"
          style="display: none"
        />
        <div @click="$refs.fileInput.click()" class="upload-content">
          <div class="upload-icon">📸</div>
          <p>Arrastra una foto aquí o haz clic para seleccionar</p>
          <small>PNG, JPG, GIF (máx 20MB)</small>
        </div>
      </div>

      <!-- Vista previa de la imagen -->
      <div v-if="selectedImage" class="preview-section">
        <img :src="selectedImage" alt="Preview" class="preview-image">
        <button @click="clearImage" class="btn-clear">✕ Limpiar</button>
      </div>

      <!-- Botón de análisis -->
      <button 
        v-if="selectedImage && !loading" 
        @click="analyzeImage" 
        class="btn-analyze"
      >
        🔍 Analizar foto
      </button>

      <!-- Loader -->
      <div v-if="loading" class="loader">
        <div class="spinner"></div>
        <p>Analizando imagen...</p>
      </div>

      <!-- Resultado -->
      <div v-if="result" class="result-section">
        <h2>📝 Descripción generada:</h2>
        <div class="result-text">{{ result }}</div>
        <button @click="copyToClipboard" class="btn-copy">📋 Copiar</button>
      </div>

      <!-- Error -->
      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      selectedImage: null,
      isDragging: false,
      loading: false,
      result: null,
      error: null
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      this.processFile(file)
    },
    handleDrop(event) {
      this.isDragging = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        this.processFile(files[0])
      }
    },
    processFile(file) {
      if (!file.type.startsWith('image/')) {
        this.error = 'Por favor selecciona una imagen válida'
        return
      }

      if (file.size > 20 * 1024 * 1024) {
        this.error = 'La imagen es muy grande (máximo 20MB)'
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.selectedImage = e.target.result
        this.error = null
        this.result = null
      }
      reader.readAsDataURL(file)
    },
    async analyzeImage() {
      this.loading = true
      this.error = null

      try {
        const base64 = this.selectedImage.split(',')[1]

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: base64
          })
        })

        if (!response.ok) {
          throw new Error('Error al analizar la imagen')
        }

        const data = await response.json()
        this.result = data.description
      } catch (err) {
        this.error = err.message || 'Error desconocido al procesar la imagen'
      } finally {
        this.loading = false
      }
    },
    clearImage() {
      this.selectedImage = null
      this.result = null
      this.error = null
      this.$refs.fileInput.value = ''
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.result)
      alert('✅ Descripción copiada al portapapeles')
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  max-width: 600px;
  width: 100%;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

.upload-zone {
  border: 3px dashed #667eea;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9ff;
  margin-bottom: 20px;
}

.upload-zone:hover {
  border-color: #764ba2;
  background: #f0f2ff;
}

.upload-zone.dragging {
  border-color: #764ba2;
  background: #e8ebff;
  transform: scale(1.02);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-content p {
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.upload-content small {
  color: #999;
  display: block;
}

.preview-section {
  position: relative;
  margin-bottom: 20px;
}

.preview-image {
  width: 100%;
  border-radius: 15px;
  max-height: 400px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.btn-clear {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: white;
  transform: scale(1.1);
}

.btn-analyze,
.btn-copy {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.btn-analyze:hover,
.btn-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-analyze:active,
.btn-copy:active {
  transform: translateY(0);
}

.loader {
  text-align: center;
  padding: 30px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader p {
  color: #667eea;
  font-weight: 600;
}

.result-section {
  background: #f8f9ff;
  border-left: 4px solid #667eea;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.result-section h2 {
  color: #333;
  font-size: 16px;
  margin-bottom: 15px;
}

.result-text {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #c62828;
  font-size: 14px;
}

@media (max-width: 600px) {
  .card {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  .upload-zone {
    padding: 30px 20px;
  }

  .upload-icon {
    font-size: 40px;
  }
}
</style>