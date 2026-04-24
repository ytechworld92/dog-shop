import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stripe, stripeUnit, stripeCurrency } from "@/lib/stripe";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  image_urls: string[];
  quantity: number;
};

export async function POST(request: NextRequest) {
  try {
    const { items, lang } = (await request.json()) as {
      items: CartItem[];
      lang: string;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? request.nextUrl.origin;
    const currency = stripeCurrency(lang);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => {
        const imageUrl =
          item.image_urls?.[0] ?? item.image_url ?? undefined;
        return {
          price_data: {
            currency,
            product_data: {
              name: item.name,
              ...(imageUrl && imageUrl.startsWith("http")
                ? { images: [imageUrl] }
                : {}),
            },
            unit_amount: stripeUnit(item.price, lang),
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${origin}/${lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${lang}/cart`,
      shipping_address_collection: {
        allowed_countries: ["JP", "US", "KR", "ES", "CA", "GB", "AU"],
      },
      locale: lang === "ja" ? "ja" : lang === "ko" ? "ko" : lang === "es" ? "es" : "en",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
