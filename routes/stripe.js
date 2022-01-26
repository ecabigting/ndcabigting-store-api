const { json } = require('express/lib/response');

const router = require('express').Router();
const stripe = require('stripe')(process.env.STRP_KEY);

router.post('/payment', (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (strpErr, strpRes) => {
      if (strpErr) {
        return res.status(500).json('Payment Error!', strpErr);
      } else {
        return res.status(200), json(strpRes);
      }
    }
  );
});

module.exports = router;
