export function exportCsv<T extends Record<string, any>>(rows: T[], name = 'export') {
  if (!rows || rows.length === 0) {
    const blob = new Blob([""], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.csv`
    a.click()
    URL.revokeObjectURL(url)
    return
  }

  const keys = Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  const header = keys.join(',')
  const lines = rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
