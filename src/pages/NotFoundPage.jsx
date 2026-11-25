import { Search } from 'lucide-react'
import { EmptyState } from '../components/common/UIPrimitives'

function NotFoundPage() {
  return (
    <EmptyState
      icon={Search}
      title="Nothing found here"
      description="The page you are looking for is unavailable."
      actionLabel="Explore sarees"
    />
  )
}

export default NotFoundPage
