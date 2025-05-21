export async function useFetch(URL) {
  const response = await fetch(URL)
  if (!response.ok) {
    throw new Error(`API failed! Error message: ${response.message}`)
  }
  return await response.json()
}

export async function useFetchSearch(URL) {
  const response = await fetch(URL)
  if (!response.ok) {
    throw new Error(`API failed! Error message: ${response.message}`)
  }
  return await response.json()
}
