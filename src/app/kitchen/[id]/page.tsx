// In your app/kitchen/[id]/page.tsx
import KitchenPage from './_components/Kitchen'

export default function Page({ params }: { params: { id: string } }) {
  return <KitchenPage kitchenId={params.id} />
}