import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import PaymentPage from "./PaymentPage";

const MoneyForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mnumber, setMnumber] = useState(0);
  const [amount, setAmount] = useState(0);
  const [hash, setHash] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [redirect, setRedirect] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    getHash();

    setRedirect(false);
  };

  const getHash = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/payment/processing",
        { name, email, mnumber, amount, transactionId }
      );
      setHash(response.data.hash);
      setTransactionId(response.data.transactionId);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getTransactionId = () => {
    const merchantPrefix = "T";
    const timestamp = Date.now();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trxId = `${merchantPrefix}${timestamp}${randomNum}`;
    return setTransactionId(trxId);
  };

  useEffect(() => {
    getTransactionId();
  });

  return (
    <>
      {redirect ? (
        <Form>
          <h1 className="mb-3">Payment Gateway</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter Your Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              onChange={(e) => {
                setMnumber(e.target.value);
              }}
              type="number"
              placeholder="Enter mobile number"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount to be paid</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Enter amount"
            />
          </Form.Group>

          <Button onClick={handleSubmit} variant="primary" type="submit">
            Check me Out
          </Button>
        </Form>
      ) : (
        <PaymentPage hash={hash} transactionId={transactionId} />
      )}
    </>
  );
};

export default MoneyForm;
