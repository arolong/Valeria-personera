import './style.css'

// ── Logo: mostrar si existe, ocultar si no ──────────────────────────────────
function initLogo(): void {
  const img         = document.getElementById('logoImg')        as HTMLImageElement | null
  const placeholder = document.getElementById('logoPlaceholder') as HTMLElement | null
  if (!img) return

  // Si la imagen ya cargó (caché del navegador)
  if (img.complete && img.naturalWidth > 0) {
    img.style.display = 'block'
    if (placeholder) placeholder.style.display = 'none'
    return
  }

  img.style.display = 'block'
  if (placeholder) placeholder.style.display = 'none'

  img.onerror = () => {
    img.style.display = 'none'
    if (placeholder) placeholder.style.display = 'flex'
  }
}

// ── QR: mostrar si existe ───────────────────────────────────────────────────
function initQR(): void {
  const qrImg         = document.getElementById('qrImg')         as HTMLImageElement | null
  const qrPlaceholder = document.getElementById('qrPlaceholder') as HTMLElement | null
  if (!qrImg) return

  qrImg.onload  = () => { qrImg.style.display = 'block'; qrPlaceholder && (qrPlaceholder.style.display = 'none') }
  qrImg.onerror = () => { qrImg.style.display = 'none';  qrPlaceholder && (qrPlaceholder.style.display = 'flex') }
}

// ── Animación de entrada con IntersectionObserver ──────────────────────────
function initScrollReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    '.nav-card, .content-card, .objetivo-card, .form-card, .qr-section, .justificacion-card'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  targets.forEach(el => observer.observe(el))
}

// ── Formulario de sugerencias ───────────────────────────────────────────────
interface FormElements extends HTMLFormControlsCollection {
  nombre:  HTMLInputElement
  grado:   HTMLSelectElement
  tipo:    HTMLSelectElement
  mensaje: HTMLTextAreaElement
}

function initForm(): void {
  const form       = document.getElementById('suggestionForm') as HTMLFormElement | null
  const successMsg = document.getElementById('successMsg')     as HTMLElement | null
  if (!form || !successMsg) return

  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()

    const btn = form.querySelector<HTMLButtonElement>('.submit-btn')
    if (!btn) return

    btn.textContent = '✨ Enviando...'
    btn.disabled    = true

    // Aquí puedes conectar un servicio real como Formspree o EmailJS
    // Por ahora simula el envío con un timeout
    setTimeout(() => {
      const elements = form.elements as FormElements
      console.info('Mensaje enviado:', {
        nombre:  elements.nombre?.value  || 'Anónimo/a',
        grado:   elements.grado.value,
        tipo:    elements.tipo.value,
        mensaje: elements.mensaje.value,
      })

      form.reset()
      successMsg.style.display = 'block'
      btn.textContent = '🌈 Enviar mensaje ✨'
      btn.disabled    = false

      setTimeout(() => { successMsg.style.display = 'none' }, 6000)
    }, 1100)
  })
}

// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLogo()
  initQR()
  initScrollReveal()
  initForm()
})
