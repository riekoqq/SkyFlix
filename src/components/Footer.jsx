import React from 'react';
import {Row, Col, Container} from "react-bootstrap";

function Footer() {
    return (
        <div className="bg-black text-light">
        <Container>
            <Row>
                <Col className="text-center py-3">Credits &copy; SkyFlix 2024</Col>
            </Row>
        </Container>
        </div>
    )
}

export default Footer;