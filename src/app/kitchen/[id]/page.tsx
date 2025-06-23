// In your app/kitchen/[id]/page.tsx
import KitchenPage from './_components/Kitchen'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params
  return <KitchenPage kitchenId={id} />
}