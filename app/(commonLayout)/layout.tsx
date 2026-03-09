import { Navbar } from "@/components/layout/Navbar";
import { getCart } from "@/services/cart.service";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartRes = await getCart();
  const cart = cartRes.data;
  const cartCount =
    cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <div>
      <Navbar cartCount={cartCount} />
      {children}
    </div>
  );
}
