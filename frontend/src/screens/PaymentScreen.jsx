import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../actions/subscriptionActions";
import CheckoutSteps from "../components/CheckoutSteps";
import "../styles/PaymentScreen.css"; // Import styles

function PaymentScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/subscription");
  };

  return (
    <div className="payment-screen">
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h2>Payment Method</h2>
        <Form onSubmit={submitHandler}>
          <div className="payment-options"> {/* ✅ Use horizontal class */}
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-check"
            />
          </div>
          <Button type="submit" variant="primary">Continue</Button>
        </Form>
      </FormContainer>
    </div>
  );
}

export default PaymentScreen;
