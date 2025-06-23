import OrderConfirmation from "./_components/Puchase";

// app/order-confirmation/[id]/page.tsx  
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderConfirmation purchaseId={id} />
}