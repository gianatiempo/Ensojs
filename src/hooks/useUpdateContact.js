import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ContactType } from '@/types'

const useUpdateContact = id => {
  const queryClient = useQueryClient()

  return useMutation(
    update => {
      const updatedContact = fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(update),
      }).then(r => r.json())
      return updatedContact
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['contacts'] })
      },
    },
  )
}

export default useUpdateContact
