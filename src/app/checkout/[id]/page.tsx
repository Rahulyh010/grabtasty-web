import CheckoutPage from "./_components/Checkout";

// app/checkout/[id]/page.tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
   const {id} = await params
    return <CheckoutPage subscriptionId={id} />
  }