// Aplica o bloco `design` do trip.json como variáveis CSS em :root e injeta as
// fontes. É a única ponte entre o JSON e a identidade visual: trocar o
// destino é trocar o JSON, e o CSS não sabe de onde as cores vieram.

export const DESIGN_PADRAO = {
  paleta: {
    noite: '#141225', cair: '#221F3A', cair2: '#2E2A4C',
    ouro: '#E0A23A', ouro2: '#F2C56B', tinta: '#D98C6B', creme: '#F4EDE0',
    ceuAlto: '#0C0B1B', ceuMeio: '#181633', ceuBaixo: '#2A2447',
    horizonte: '#3B3060', silhueta: '#1A1735',
  },
  fontes: {
    display: '"Fraunces", Georgia, "Times New Roman", serif',
    ui: '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
    google: 'family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Instrument+Sans:wght@400;500;600',
  },
  horizonte: null,
  momento: null,
}

const VAR = {
  noite: '--noite', cair: '--cair', cair2: '--cair2', ouro: '--ouro', ouro2: '--ouro2',
  tinta: '--tinta', creme: '--creme', ceuAlto: '--ceu-alto', ceuMeio: '--ceu-meio',
  ceuBaixo: '--ceu-baixo', horizonte: '--ceu-horizonte', silhueta: '--silhueta',
}

// ouro2 é o brilho do ouro; se o destino não definiu, deriva-se clareando.
const clarear = (hex, f = 0.18) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.min(255, Math.round(v + (255 - v) * f))
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c).map((v) => v.toString(16).padStart(2, '0')).join('')
}

export function aplicarDesign(design) {
  const d = {
    ...DESIGN_PADRAO, ...design,
    paleta: { ...DESIGN_PADRAO.paleta, ...(design?.paleta || {}) },
    fontes: { ...DESIGN_PADRAO.fontes, ...(design?.fontes || {}) },
  }
  if (!design?.paleta?.ouro2 && design?.paleta?.ouro) d.paleta.ouro2 = clarear(design.paleta.ouro)

  const raiz = document.documentElement.style
  for (const [k, v] of Object.entries(d.paleta)) if (VAR[k] && v) raiz.setProperty(VAR[k], v)
  raiz.setProperty('--display', d.fontes.display)
  raiz.setProperty('--ui', d.fontes.ui)

  // Fontes do Google com display=swap: o texto aparece na fonte local e troca
  // quando a web font chega. Offline, a pilha de fallback segura o layout.
  if (d.fontes.google && !document.getElementById('fontes-destino')) {
    const link = document.createElement('link')
    link.id = 'fontes-destino'; link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${d.fontes.google}&display=swap`
    document.head.appendChild(link)
  }
  return d
}
