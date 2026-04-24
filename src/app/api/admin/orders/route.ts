import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";

function isAuthed(request: NextRequest): boolean {
  return (
    request.cookies.get("admin_token")?.value === process.env.ADMIN_PASSWORD
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
      expand: ["data.line_items", "data.customer_details"],
    });

    const orders = sessions.data
      .filter((s) => s.payment_status === "paid")
      .map((s) => {
        type AddressLike = {
          line1?: string | null;
          line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
        };
        const shippingDetails = (
          s as unknown as {
            shipping_details?: { address?: AddressLike | null } | null;
          }
        ).shipping_details;
        const shippingAddress: AddressLike | null =
          shippingDetails?.address ?? s.customer_details?.address ?? null;

        return {
          id: s.id,
          created: s.created,
          amount_total: s.amount_total,
          currency: s.currency,
          customer_email: s.customer_details?.email ?? null,
          customer_name: s.customer_details?.name ?? null,
          shipping_address: shippingAddress,
          items:
            s.line_items?.data.map((li) => ({
              description: li.description,
              quantity: li.quantity,
              amount: li.amount_total,
            })) ?? [],
          payment_status: s.payment_status,
        };
      });

    return NextResponse.json(orders);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
