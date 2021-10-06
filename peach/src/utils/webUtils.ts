interface download {
  (filename: string, text:string): void
}

/**
 * @description Method to trigger download on web
 * @param filename name of file
 * @param text file content
 */
export const download: download = (filename, text) => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}