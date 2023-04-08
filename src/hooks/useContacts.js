import { useQuery } from '@tanstack/react-query'

const useContacts = q => {
  return useQuery(['contacts', q], async () => {
    const contacts = await fetch(`/api/contact${q ? `?q=${q}` : ``}`).then(r => r.json())
    return contacts
  })
}

export default useContacts
