import React, {useEffect, useState} from "react";

import {Link} from "react-router-dom";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import {Container, Nav, Navbar, NavbarBrand, NavDropdown, NavLink} from "react-bootstrap";

import {deleteToken, GetToken} from "../Tokens";

const Navigation = () => {

    const [auth, setAuth] = useState(false);

    useEffect(() => {
        if (GetToken()) {
            setAuth(true);
        }
    });

    const logout = (event) => {
        event.preventDefault();
        deleteToken();
        setAuth(false);
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <NavbarBrand>
                    <Link style={{color: '#000'}} className="link" to="/">FastAPI Anti-YouTube</Link>
                </NavbarBrand>
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink><Link className="link" to="/">Home</Link></NavLink>
                        <NavDropdown id="auth-dropdown" title="Auth">
                            {
                                !auth ? (
                                    <>
                                        <NavDropdown.Item>
                                            <Link className="link" to="/register">Registration</Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Link className="link" to="/login">Login</Link>
                                        </NavDropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavDropdown.Item>
                                            <span className="link" onClick={logout}>Logout</span>
                                        </NavDropdown.Item>
                                    </>
                                )
                            }

                        </NavDropdown>
                    </Nav>
                </NavbarCollapse>
            </Container>
        </Navbar>
    );

};

export default Navigation;
