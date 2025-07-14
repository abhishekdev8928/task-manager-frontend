import React from "react";
import { Row, Col, Container } from "reactstrap";

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        {/* <Col sm={6}>
                             © DiigiiHost.
                            </Col> */}
                        <Col sm={12}>
                            <div className="text-sm-end d-none d-sm-block">
                               © {new Date().getFullYear()} All Rights Reserved. <a href="https://DiigiiHost.com" target="_blank" rel="noopener noreferrer">DiigiiHost</a>
                                </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
