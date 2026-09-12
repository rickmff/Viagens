// Ícones de traço, 24×24, desenhados à mão no arquivo — nada externo para
// falhar offline. Só marcos e objetos genéricos; nunca personagem ou logotipo.
const ICONES = {
  plane: '<path d="M2.5 12 21 3.5l-6 17-3.5-7.2L2.5 12z"/><path d="M11.5 13.3 21 3.5"/>',
  train: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 7h6M8 21l2-4M16 21l-2-4M9 14.5h.01M15 14.5h.01"/>',
  suitcase: '<path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><rect x="3.5" y="7" width="17" height="13" rx="2"/><path d="M8.5 7v13M15.5 7v13"/>',
  castle: '<path d="M4 21V9l2-2.5L8 9v12M10 21V6l2-3 2 3v15M16 21V9l2-2.5L20 9v12M3 21h18M11 21v-4h2v4"/>',
  museum: '<path d="M3 9.5 12 4l9 5.5M4 9.5h16M5 9.5V19M9 9.5V19M15 9.5V19M19 9.5V19M3 21h18M3 19h18"/>',
  pyramid: '<path d="M12 4 3 20h18L12 4z"/><path d="M12 4v16M6.6 13.6h10.8M9.3 8.8h5.4"/>',
  eiffel: '<path d="M12 3c-.6 4.2-2 9.6-6.5 18H9l3-6 3 6h3.5C14 12.6 12.6 7.2 12 3z"/><path d="M8.7 15h6.6M10 10h4M9 21c1-.8 2-1.2 3-1.2s2 .4 3 1.2"/>',
  dome: '<path d="M4 21v-8a8 8 0 0 1 16 0v8M3 21h18M4 13h16"/><path d="M12 5V2.5M10.5 3.5h3"/><path d="M9.5 21v-4a2.5 2.5 0 0 1 5 0v4"/>',
  torii: '<path d="M3 6c3-1 15-1 18 0M4 9.5h16M7 6v15M17 6v15M6 3.5c4 .6 8 .6 12 0"/>',
  temple: '<path d="M3 10 12 4l9 6M5 10v10M19 10v10M3 20h18M8 20v-6h8v6M12 4V2"/>',
  boat: '<path d="M3 15h18l-2 4H5l-2-4zM12 15V4M12 4l6 8H6l6-8z"/>',
  beach: '<circle cx="8" cy="8" r="3.5"/><path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 16.5c2-1.5 4-1.5 6 0M16 3v2M20.5 7.5l-1.4 1.4"/>',
  mountain: '<path d="M3 20 9 8l3 5 3-8 6 15H3z"/><path d="M8 13l1.5-2.5L11 13"/>',
  food: '<path d="M6 3v7a3 3 0 0 0 6 0V3M9 3v18M18 3c-2 1-3 4-3 8h3v10"/>',
  market: '<path d="M3 9h18l-1.5-5h-15L3 9z"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v8h14v-8M10 20v-5h4v5"/>',
  onsen: '<path d="M4 14c2-3 14-3 16 0M4 18c2-3 14-3 16 0"/><path d="M8 4c-1 2 1 3 0 5M12 3c-1 2 1 3 0 5M16 4c-1 2 1 3 0 5"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2V5h14v1a2 2 0 0 0 2 2v3a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2v3H5v-3a2 2 0 0 0-2-2v-1a2 2 0 0 0 2-2V8z"/><path d="M13 5v14"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  tree: '<path d="M12 3 6 11h3l-4 6h5v4h4v-4h5l-4-6h3L12 3z"/>',
  leaf: '<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z"/><path d="M4 20 14 10"/>',
  wine: '<path d="M8 3h8l-1 7a3 3 0 0 1-6 0L8 3zM12 13v7M8 20h8"/>',
  snow: '<path d="M12 3v18M3 12h18M6.2 6.2l11.6 11.6M17.8 6.2 6.2 17.8"/><path d="m12 3-2 2m2-2 2 2m-2 16-2-2m2 2 2-2M3 12l2-2m-2 2 2 2m16-2-2-2m2 2-2 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><path d="M12 9.5v5M10.5 11h3"/>',
  column: '<path d="M5 4h14M6 4v2h12V4M8 6v12M12 6v12M16 6v12M5 18h14v2H5z"/>',
  fountain: '<path d="M12 3v4M8 7h8M10 7c0 3-2 5-4 6M14 7c0 3 2 5 4 6M4 15h16l-2 5H6l-2-5zM9 13.5c1 1.2 5 1.2 6 0"/>',
  bed: '<path d="M3 18V8a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v3h9v6M3 14h18M3 18v2M21 18v2"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6zM9 4v14M15 6v14"/>',
  bag: '<path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2z"/>',
}

export const nomesDeIcones = Object.keys(ICONES)

// Fallback pelo tipo do primeiro bloco do dia, quando o roteiro não escolheu.
export const iconePorTipo = {
  deslocamento: 'train', refeicao: 'food', atracao: 'camera', descanso: 'bed',
  compras: 'bag', evento: 'ticket', livre: 'sun',
}

export function Icone({ nome, className = 'icone' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}
         dangerouslySetInnerHTML={{ __html: ICONES[nome] || ICONES.star }} />
  )
}
