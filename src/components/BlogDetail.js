import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
} from 'mdb-react-ui-kit';
import './Home.css';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/details/${id}/`);
        setBlog(res.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) {
    return (
      <MDBContainer className="py-5 text-center">
        <h2>Loading blog...</h2>
      </MDBContainer>
    );
  }

  if (error || !blog) {
    return (
      <MDBContainer className="py-5 text-center">
        <h2>Blog not found</h2>
        <MDBBtn color="primary" onClick={handleBack}>Back to Home</MDBBtn>
      </MDBContainer>
    );
  }

  return (
    <div className="home-page">

      <MDBNavbar expand='lg' light bgColor='light' className='mb-4 fixed-top'>
        <MDBContainer fluid>
          <MDBNavbarBrand href="#">Blog App</MDBNavbarBrand>
          <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink href='/home'>Home</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/my'>My Blogs</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/profile'>Profile</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
          <MDBBtn color='danger' size='sm' onClick={handleLogout}>Logout</MDBBtn>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer className="py-5">
        <MDBCard className="my-5">
          <MDBCardBody>
            <MDBCardTitle className="h2 mb-4">{blog.title}</MDBCardTitle>
            <div className="d-flex justify-content-between mb-4">
              <span className="text-muted">By {blog.user}</span>
              <span className="text-muted">{blog.created_at}</span>
            </div>
            <MDBCardText>{blog.content}</MDBCardText>
            <div className="mt-4">
              <MDBBtn color='primary' onClick={handleBack}>Back to My Blogs</MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default BlogDetail;
