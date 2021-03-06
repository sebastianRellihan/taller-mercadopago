const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
})

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },
    callback: (req, res) => {

        if (req.query.status.includes('success')) {
            return res.render('success', {
                payment_type: req.query.payment_type,
                external_reference: req.query.external_reference,
                collection_id: req.query.collection_id
            });
        }

        if (req.query.status.includes('pending')) {
            return res.render('pending');
        }

        if (req.query.status.includes('failure')) {
            return res.render('failure');
        }
    },

    webhooks: (req, res) => {
        console.log('webhooks :', req.body);
        res.status(200).end('ok')
    },
    buy: (req, res) => {
        const host = 'https://mercado-pago-cert-sr.herokuapp.com/';
        const url = host + 'callback?status=';

        let preference = {

            back_urls: {
                success: url + 'success',
                pending: url + 'pending',
                failure: url + 'failure'
            },

            notification_url: host + 'webhooks',

            auto_return: 'approved',

            payer: {
                name: 'Lalo',
                surname: 'Landa',
                email: 'test_user_63274575@testuser.com',
                phone: {
                    area_code: '11',
                    number: 22223333
                },
                address: {
                    zip_code: '1111',
                    street_name: 'False',
                    street_number: 123
                }
            },
            external_reference: 'srellihan@gmail.com',
            payment_methods: {
                excluded_payment_methods: [
                    { id : 'amex' }
                ],
                excluded_payment_types: [
                    { id : 'atm' }
                ],
                installments: 6
            },
            items: [
                {
                id: '1234',
                title: String(req.body.title),
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: 'https://mercado-pago-cert-sr.herokuapp.com/images/products/' + req.body.title + '.jpg',
                quantity: 1,
                currency_id: 'ARS',
                unit_price: Number(req.body.price),
                }
            ]
        };

        mercadopago.preferences.create(preference)
            .then(response => {
                global.init_point = response.body.init_point;
                return res.render('confirm');
            })
            .catch(error => {
                console.log(error);
                res.send('error');
            })

    }
}