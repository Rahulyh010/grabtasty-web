import CheckoutPage from "./_components/Checkout";

// app/checkout/[id]/page.tsx
export default function Page({ params }: { params: { id: string } }) {
    return <CheckoutPage subscriptionId={params.id} />
  }