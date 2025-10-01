// In your app/kitchen/[id]/page.tsx
// import KitchenPage from './_components/Kitchen'
// import KitchenSubscriptionsPage from "./_components/KitchenSubscriptionsPage";
import { KitchenPageNew } from "./_newcomponents/Kitchen";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KitchenPageNew kitchenId={id} />;
}
