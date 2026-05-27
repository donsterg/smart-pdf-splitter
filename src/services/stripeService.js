export const redirectToCheckout =
  async (user) => {

    try {

      const response =
        await fetch(
            '/api/create-checkout-session',
            {
            method: 'POST',

            headers: {
                'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
                userId:
                user.id,
            }),
            }
        );

      const data =
        await response.json();

      if (data.url) {

        window.location.href =
          data.url;

      } else {

        console.error(data);

        alert(
          'Stripe checkout failed.'
        );
      }

    } catch (error) {

      console.error(
        'Stripe error:',
        error
      );

      alert(
        'Checkout failed.'
      );
    }
};