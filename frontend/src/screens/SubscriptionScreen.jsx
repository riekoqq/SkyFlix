import React, { useEffect, useState } from "react";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import CheckoutSteps from "../components/CheckoutSteps"; // ✅ Added CheckoutSteps
import { subscribe } from "../actions/subscriptionActions";
import { userProfile } from "../actions/userActions";
import "../styles/SubscriptionScreen.css"; // Import the styles

function SubscriptionScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userProfile);
  const { loading, error, success } = useSelector((state) => state.subscription);

  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect if not logged in
    } else if (success) {
      navigate("/"); // Redirect after successful subscription
    } else if (!sdkReady) {
      const addPayPalScript = () => {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=Af2B1MP_pSepKigZk8eOfTOgJUzmrbFm5KUsE3feb-4BCqK3tuoNd20WKO8nPIFkZnN0WfmAwqo-igBQ&currency=USD";
        script.async = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);
      };
      addPayPalScript();
    }
  }, [userInfo, success, sdkReady, navigate]);

  const createOrderHandler = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: "9.99" } }],
    });
  };

  const successPaymentHandler = async () => {
    await dispatch(subscribe());
    await dispatch(userProfile()); // Update user role after subscription
  };

  return (
    <>
      {/* ✅ Include Checkout Steps */}
      <CheckoutSteps step1 step2 step3 />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <h2>Premium Subscription</h2>
          <Row className="mt-4">
            <Col md={{ span: 6, offset: 3 }}>
              <Card className="subscription-card">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>Subscription Summary</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Price</Col><Col>$9.99</Col></Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Duration</Col><Col>30 days</Col></Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row><Col>Total</Col><Col>$9.99</Col></Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalScriptProvider options={{ "client-id": "Af2B1MP_pSepKigZk8eOfTOgJUzmrbFm5KUsE3feb-4BCqK3tuoNd20WKO8nPIFkZnN0WfmAwqo-igBQ" }}>
                        <PayPalButtons
                          createOrder={createOrderHandler}
                          style={{ layout: "vertical" }}
                          onApprove={successPaymentHandler}
                        />
                      </PayPalScriptProvider>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default SubscriptionScreen;
