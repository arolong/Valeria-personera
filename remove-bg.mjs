// remove-bg.mjs — elimina fondo blanco/claro de imágenes MLP
import pkg from 'jimp'
const Jimp = pkg.default ?? pkg
import { readdirSync } from 'fs'
import { join } from 'path'

const IMAGES_DIR = './public/images'
const THRESHOLD  = 60   // tolerancia de color (0=exacto, 255=todo)

const files = readdirSync(IMAGES_DIR).filter(f =>
  f.startsWith('mlp') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
)

if (files.length === 0) {
  console.log('No se encontraron imágenes mlp*.png')
  process.exit(0)
}

for (const file of files) {
  const inputPath  = join(IMAGES_DIR, file)
  // Siempre guardamos como .png para soportar transparencia
  const outputName = file.replace(/\.(jpg|jpeg)$/i, '.png')
  const outputPath = join(IMAGES_DIR, outputName)

  console.log(`Procesando: ${file} → ${outputName}`)

  const image = await Jimp.read(inputPath)

  // Color de referencia: tomamos la esquina superior izquierda como "fondo"
  const bgColor = image.getPixelColor(0, 0)
  const bgR = (bgColor >> 24) & 0xff
  const bgG = (bgColor >> 16) & 0xff
  const bgB = (bgColor >>  8) & 0xff

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]

    const dist = Math.sqrt(
      (r - bgR) ** 2 +
      (g - bgG) ** 2 +
      (b - bgB) ** 2
    )

    // Si el pixel es muy parecido al color de fondo → transparente
    if (dist < THRESHOLD) {
      this.bitmap.data[idx + 3] = 0
    }
  })

  await image.write(outputPath)
  console.log(`  ✅ Guardado: ${outputName}`)
}

console.log('\n🎉 ¡Listo! Todas las imágenes procesadas.')
