const crypto = require('crypto');
const axios = require('axios');
const querystring = require('querystring');

exports.initiatePayment = async (req, res) => {
  try {
    console.log('Payment initiation request received:', req.body);
    const { orderId, totalAmount, userEmail, userAddress } = req.body;

    // Test modu için PayTR tarafından sağlanan örnek değerler
    const merchantId = process.env.PAYTR_MERCHANT_ID;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    const paymentAmount = Math.floor(totalAmount * 100);
    const merchantOid = orderId;
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const noInstallment = '1';
    const maxInstallment = '1';
    const currency = 'TL';
    const testMode = '1'; // Test modu için 1 olarak ayarlandı

    // PayTR token hesaplama
    const hashStr = `${merchantId}${userIp}${merchantOid}${userEmail}${paymentAmount}${noInstallment}${maxInstallment}${currency}${testMode}${merchantSalt}`;
    const paytrToken = crypto.createHmac('sha256', merchantKey).update(hashStr).digest('base64');

    const postData = {
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: JSON.stringify([["Ürün", totalAmount, 1]]),
      debug_on: '1',
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: 'Test Kullanıcı',
      user_address: userAddress,
      user_phone: '05555555555',
      merchant_ok_url: `${process.env.FRONTEND_URL}/payment-success`,
      merchant_fail_url: `${process.env.FRONTEND_URL}/payment-fail`,
      timeout_limit: '30',
      currency: currency,
      test_mode: testMode
    };
    console.log('PayTR API request data:', JSON.stringify(postData, null, 2));
    let response;
    try {
      console.log('Sending request to PayTR API...');
      response = await axios.post('https://www.paytr.com/odeme/api/get-token-dev', querystring.stringify(postData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('PayTR API response:', JSON.stringify(response.data, null, 2));
    } catch (apiError) {
      console.error('PayTR API error:', apiError.response ? JSON.stringify(apiError.response.data, null, 2) : apiError.message);
      console.error('Full error object:', JSON.stringify(apiError, null, 2));
      throw new Error(apiError.response ? JSON.stringify(apiError.response.data) : apiError.message);
    }

    if (response.data.status === 'success') {
      res.json({ token: response.data.token });
    } else {
      throw new Error('PayTR token alınamadı: ' + JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('Ödeme başlatma hatası:', error.message);
    res.status(500).json({ 
      error: 'Ödeme başlatılırken bir hata oluştu', 
      details: error.message 
    });
  }
};