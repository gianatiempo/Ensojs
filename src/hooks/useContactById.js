import { useQuery } from '@tanstack/react-query'

const useContactById = id => {
  return useQuery(['contacts', id], async () => {
    const contact = await fetch(`/api/contact/${id}`).then(r => r.json())
    if (!contact) {
      throw new Error('Not Found')
    }
    return contact
  })
}

export default useContactById
