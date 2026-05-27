import Stripe from 'stripe';
import ws from 'ws';
import { buffer } from 'micro';

import {
  createClient
} from '@supabase/supabase-js';

const stripe =
  new Stripe(
    process.env.STRIPE_SECRET_KEY
  );

const supabase =
  createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      realtime: {
        transport: ws,
      },
    }
  );

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(
  req,
  res
) {

  if (req.method !== 'POST') {

    return res.status(405).send(
      'Method not allowed'
    );
  }

  const sig =
    req.headers['stripe-signature'];

  let event;

  try {

    const rawBody =
      await buffer(req);

    event =
      stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env
          .STRIPE_WEBHOOK_SECRET
      );

  } catch (err) {

    console.error(
      'Webhook signature failed:',
      err.message
    );

    return res.status(400).send(
      `Webhook Error: ${err.message}`
    );
  }

  try {

    if (
      event.type ===
      'checkout.session.completed'
    ) {

      const session =
        event.data.object;

      const userId =
        session.client_reference_id;
        console.log(
  'Webhook session:',
  session
);

console.log(
  'Webhook userId:',
  userId
);

      const customerId =
        session.customer;

      const subscriptionId =
        session.subscription;

      const subscription =
        await stripe.subscriptions.retrieve(
          subscriptionId
        );

      const {
        data,
        error
      } = await supabase
        .from('subscriptions')
        .upsert({
          user_id:
            userId,

          stripe_customer_id:
            customerId,

          stripe_subscription_id:
            subscriptionId,

          subscription_status:
            subscription.status,

          subscription_tier:
            'pro',

          current_period_end:
            new Date(
              subscription.current_period_end
              * 1000
            ),
        })
        .select();

      console.log(
        'Supabase result:',
        data
      );

      console.error(
        'Supabase error:',
        error
      );

      console.log(
        'User upgraded to Pro:',
        userId
      );
    }

    res.status(200).json({
      received: true,
    });

  } catch (error) {

    console.error(
      'Webhook processing error:',
      error
    );

    res.status(500).send(
      'Webhook handler failed'
    );
  }
}