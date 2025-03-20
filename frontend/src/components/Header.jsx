import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import SearchBar from './SearchBar'; // ✅ Import SearchBar

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <Navbar expand="lg" bg="black" variant="dark">
            <Container>
                <Link to="/" className="navbar-brand fw-bold">SkyFlix</Link>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {userInfo && (
                            <Link to="/profile" className="nav-link">
                                <i className="fa-solid fa-user"></i> Account
                            </Link>
                        )}
                        <Link to="/browse" className="nav-link">Browse</Link>
                    </Nav>

                    {/* ✅ Integrated SearchBar */}
                    <div className="me-3">
                        <SearchBar />
                    </div>

                    {/* ✅ Display Login or Logout */}
                    {userInfo ? (
                        <>
                            <span className="text-white me-3">Welcome, {userInfo.email}</span>
                            <Button variant="outline-light" onClick={logoutHandler}>Logout</Button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-outline-light">
                            Login
                        </Link>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
