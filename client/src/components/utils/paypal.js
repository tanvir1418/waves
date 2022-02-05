import React, { Component } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

class Paypal extends Component {
    render() {

        const onSuccess = (payment) => {
            //console.log(JSON.stringify(payment))

            this.props.onSuccess(payment);

            // {
            //     paid: true
            //     cancelled: false
            //     payerID: "H5U23GJQX2YYW"
            //     paymentID: "PAYID-L2PTBWY49162538HX8545218"
            //     paymentToken: "EC-0LU54322TB585835J"
            //     returnUrl: "https://www.paypal.com/checkoutnow/error?paymentId=PAYID-L2PTBWY49162538HX8545218&token=EC-0LU54322TB585835J&PayerID=H5U23GJQX2YYW"
            //     address:
            //     recipient_name: "Tanvir Ahmed"
            //     line1: "1 Main St"
            //     city: "San Jose"
            //     state: "CA"
            //     postal_code: "95131"
            //     country_code: "US"
            //     __proto__: Object
            //     email: "tanvirpersonal@gmail.com"
            // }

        }

        const onCancel = (data) => {
            console.log(JSON.stringify(data))
        }

        const onError = (err) => {
            console.log(JSON.stringify(err))
        }

        let env = 'sandbox';
        let currency = 'USD';
        let total = this.props.toPay;

        const client = {
            sandbox: 'AYaUHBAn7iMB3UYDzZ3Q0YnLXhsyRO22lIEzwfYWZC7ULHxb4K-r-QJL5w1QP61L58tIEl-y4I_mgg5Y',
            production: ''
        }

        return (
            <div>
                <PaypalExpressBtn
                    env={env}
                    client={client}
                    currency={currency}
                    total={total}
                    onError={onError}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    style={{
                        size:'large',
                        color:'blue',
                        shape: 'rect',
                        label: 'checkout'
                    }}
                />
            </div>
        );
    }
}

export default Paypal;