import { useCallback, useEffect, useState } from 'react'

/**
 * Estado que sobrevive ao refresh, guardado por viagem. É o que faz o
 * checklist de bagagem e os blocos marcados como feitos continuarem lá no
 * meio da viagem, com o celular na mão e o site aberto de novo.
 *
 * localStorage falha em aba anônima, com cookies bloqueados e em preview de
 * link — então toda leitura e escrita é protegida e o site funciona igual
 * quando ele não está disponível, só sem lembrar nada.
 */
export function usePersistido(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const bruto = localStorage.getItem(chave)
      return bruto ? JSON.parse(bruto) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch { /* sem persistência: segue funcionando na memória da sessão */ }
  }, [chave, valor])

  return [valor, setValor]
}

/** Conjunto de IDs marcados — a forma que checklist e roteiro usam. */
export function useMarcados(chave) {
  const [lista, setLista] = usePersistido(chave, [])
  const marcados = new Set(lista)

  const alternar = useCallback((id) => {
    setLista((atual) => atual.includes(id)
      ? atual.filter((x) => x !== id)
      : [...atual, id])
  }, [setLista])

  const limpar = useCallback(() => setLista([]), [setLista])

  return { marcados, alternar, limpar, total: lista.length }
}
