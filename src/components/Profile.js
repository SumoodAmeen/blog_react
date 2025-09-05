import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn,
  MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink
} from 'mdb-react-ui-kit';
import axios from 'axios';
import './Home.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const res = await axios.get('http://imsar.shop/api/user/', {
          headers: { Authorization: `Token ${token}` }
        });

        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/'); 
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="home-page">

      <MDBNavbar expand="lg" dark bgColor="dark" className="mb-4 fixed-top">
  <MDBContainer fluid>
    <MDBNavbarBrand href="/">Blog App</MDBNavbarBrand>

    {/* Hamburger Toggler */}
    <MDBNavbarToggler
      type="button"
      aria-expanded="false"
      aria-label="Toggle navigation"
      onClick={() => setShowNav(!showNav)}
    >
      <i className="fas fa-bars" style={{ color: "white", fontSize: "1.5rem" }}></i>
    </MDBNavbarToggler>

    {/* Collapsible Nav */}
    <MDBCollapse navbar open={showNav}>
      <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
        <MDBNavbarItem>
          <MDBNavbarLink href="/">Home</MDBNavbarLink>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBNavbarLink href="/my">My Blogs</MDBNavbarLink>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBNavbarLink active aria-current="page" href="/profile">
            Profile
          </MDBNavbarLink>
        </MDBNavbarItem>
      </MDBNavbarNav>
      <MDBBtn color="danger" size="sm" onClick={handleLogout}>
        Logout
      </MDBBtn>
    </MDBCollapse>
  </MDBContainer>
</MDBNavbar>


      <MDBContainer className="py-5">
        <h2 className="text-center mb-5">User Profile</h2>
        <MDBRow className="justify-content-center">
          <MDBCol md="8" lg="6">
            <MDBCard>
              <MDBCardBody>
                <div className="text-center mb-4">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '150px' }}
                  />
                  <h5 className="mt-3">{user.username}</h5>
                  <p className="text-muted mb-4">{user.email}</p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold">About</h6>
                  <p>
                    This is your profile page. You can update your information here.
                  </p>
                </div>

                <div className="text-center">
                  <MDBBtn color='primary'>Edit Profile</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profile;