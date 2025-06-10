import OrderConfirmation from "./_components/Puchase";

// app/order-confirmation/[id]/page.tsx  
export default function Page({ params }: { params: { id: string } }) {
  return <OrderConfirmation purchaseId={params.id} />
}