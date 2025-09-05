import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle,
  MDBCardText, MDBBtn, MDBNavbar, MDBNavbarBrand,
  MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBNavbarToggler, MDBCollapse
} from 'mdb-react-ui-kit';
import './Home.css';


function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    axios
      .get('http://imsar.shop/api/')
      .then((response) => setData(response.data))
      .catch((error) => console.log("Error fetching blogs"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };
    const openCreate = () => {
    if (!currentUser) {
      navigate('/auth');
    } else {
      navigate('/my');
    }
  };

  return (
    <div className="home-page">

<MDBNavbar expand="lg" dark bgColor="dark" className="mb-4 fixed-top">
  <MDBContainer fluid>
    <MDBNavbarBrand href="/">Blog App</MDBNavbarBrand>

    {/* Toggler */}
    <MDBNavbarToggler
      type="button"
      aria-expanded={showNavbar ? 'true' : 'false'}
      aria-label="Toggle navigation"
      onClick={() => setShowNavbar(!showNavbar)}
    >
      <i className="fas fa-bars" style={{ color: "white", fontSize: "1.5rem" }}></i>
    </MDBNavbarToggler>

    {/* Collapse */}
    <MDBCollapse navbar open={showNavbar} id="navbarNav">
      <div className="d-flex w-100 justify-content-between align-items-center">
        
        {/* Left side links */}
        <MDBNavbarNav className="mb-2 mb-lg-0">
          <MDBNavbarItem>
            <MDBNavbarLink href="/home">Home</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href={currentUser ? "/my" : "/auth"}>
              My Blogs
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href={currentUser ? "/profile" : "/auth"}>
              Profile
            </MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>

        {/* Right side buttons */}
        <MDBNavbarNav className="d-flex flex-row align-items-center">
          {currentUser ? (
            <>
              <MDBNavbarItem className="ms-2">
                <MDBBtn color="success" size="sm" onClick={openCreate}>
                  Create Blog
                </MDBBtn>
              </MDBNavbarItem>
              <MDBNavbarItem className="ms-2">
                <MDBBtn color="danger" size="sm" onClick={handleLogout}>
                  Logout
                </MDBBtn>
              </MDBNavbarItem>
            </>
          ) : (
            <MDBNavbarItem className="ms-2">
              <MDBBtn color="primary" size="sm" onClick={() => navigate("/auth")}>
                Login
              </MDBBtn>
            </MDBNavbarItem>
          )}
        </MDBNavbarNav>
      </div>
    </MDBCollapse>
  </MDBContainer>
</MDBNavbar>



    


      <MDBContainer className="py-5">
        <h2 className="text-center mb-5">Latest Blog Posts</h2>
        <MDBRow className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {data.map((item) => (
            <MDBCol key={item.id}>
              <MDBCard className="h-100">
                <MDBCardBody>
                  <MDBCardTitle>{item.title}</MDBCardTitle>
                  <div className="d-flex justify-content-between mb-3">
                    <small className="text-muted">By {item.user}</small>
                    <small className="text-muted">{item.created_at}</small>
                  </div>
                  <MDBCardText>{item.content.substring(0, 100)}...</MDBCardText>
                  <div className="mt-3">

                    <MDBBtn color='primary' onClick={() => navigate(`/blog/${item.id}`)}>
                      Read More
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
     </div >
  );
}

export default Home;
