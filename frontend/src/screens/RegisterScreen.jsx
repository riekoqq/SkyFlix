import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';

function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register(email, password));
    };

  return (
    <Container className="my-5" style={{ maxWidth: '500px' }}>
        <Card className="p-4 shadow rounded">
            <h2 className="text-center mb-4">Register</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Alert variant="info">Loading...</Alert>}

            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">Register</Button>
            </Form>
        </Card>
    </Container>
  )
}

export default RegisterScreen
