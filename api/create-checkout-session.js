import Stripe from 'stripe';

const stripe =
  new Stripe(
    process.env.STRIPE_SECRET_KEY
  );

export default async function handler(
  req,
  res
) {

  if (req.method !== 'POST') {

    return res.status(405).json({
      error:
        'Method not allowed',
    });
  }

  try {

    const { userId } = req.body;
    const session =
      await stripe.checkout.sessions.create({

        client_reference_id:
            userId,
            
        payment_method_types: [
          'card',
        ],

        mode:
          'subscription',

        line_items: [
          {
            price:
              process.env
                .VITE_STRIPE_PRICE_ID,

            quantity: 1,
          },
        ],

        success_url:
          `${req.headers.origin}?success=true`,

        cancel_url:
          `${req.headers.origin}?canceled=true`,
      });

    res.status(200).json({
      url: session.url,
    });

  } catch (error) {

    res.status(500).json({
      error:
        error.message,
    });
  }
}