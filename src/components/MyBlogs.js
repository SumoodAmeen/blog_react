import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,
  MDBBtn, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink,
  MDBNavbarToggler, MDBCollapse, MDBIcon, MDBModal, MDBModalDialog, MDBModalContent,
  MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBInput
} from 'mdb-react-ui-kit';
import './Home.css';

function MyBlogs() {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', content: '' });
  const [showNavbar, setShowNavbar] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailBlog, setDetailBlog] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const [updateForm, setUpdateForm] = useState({ id: null, title: '', content: '' });

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');

        const res = await axios.get('http://imsar.shop/api/my/', {
          headers: { Authorization: `Token ${token}` }
        });

        setMyPosts(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        navigate('/');
      }
    };

    fetchMyPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const openCreate = () => {
    setCreateForm({ title: '', content: '' });
    setShowCreate(true);
  };

  const submitCreate = async () => {
    if (!createForm.title.trim() || !createForm.content.trim()) return;

    try {
      setCreating(true);
      const token = localStorage.getItem('token');

      await axios.post('http://imsar.shop/api/create/', {
        title: createForm.title,
        content: createForm.content,
      }, { headers: { Authorization: `Token ${token}` } });

      const res = await axios.get('http://imsar.shop/api/my/', {
        headers: { Authorization: `Token ${token}` }
      });
      setMyPosts(res.data || []);
      setShowCreate(false);
    } catch (e) {
      alert('Failed to create blog');
    } finally {
      setCreating(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="home-page">

<MDBNavbar expand='lg' dark bgColor='dark' className='mb-4 fixed-top'>
  <MDBContainer fluid>
    <MDBNavbarBrand href='/'>Blog App</MDBNavbarBrand>

    {/* Hamburger Toggler */}
    <MDBNavbarToggler
      type='button'
      aria-controls='navbarNav'
      aria-expanded={showNavbar ? 'true' : 'false'}
      aria-label='Toggle navigation'
      onClick={() => setShowNavbar(!showNavbar)}
    >
      <MDBIcon icon='bars' fas />
    </MDBNavbarToggler>

    {/* Collapsible Nav */}
    <MDBCollapse navbar open={showNavbar} id='navbarNav'>
      <div className="d-flex w-100 justify-content-between align-items-center">
        
        {/* Left side links */}
        <MDBNavbarNav className='mb-2 mb-lg-0'>
          <MDBNavbarItem>
            <MDBNavbarLink href='/home'>Home</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='/my' active>My Blogs</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='/profile'>Profile</MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>

        {/* Right side buttons */}
        <MDBNavbarNav className='d-flex flex-row align-items-center'>
          <MDBNavbarItem className='ms-2'>
            <MDBBtn color='success' size='sm' onClick={openCreate}>
              Create Blog
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem className='ms-2'>
            <MDBBtn color='danger' size='sm' onClick={handleLogout}>
              Logout
            </MDBBtn>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </div>
    </MDBCollapse>
  </MDBContainer>
</MDBNavbar>





      <MDBContainer className="py-5">
        <h2 className="text-center mb-5">My Blog Posts</h2>
        {loading ? (
          <h5 className="text-center">Loading...</h5>
        ) : myPosts.length === 0 ? (
          <h5 className="text-center">No posts created by you yet.</h5>
        ) : (
          <MDBRow className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {myPosts.map((item) => (
              <MDBCol key={item.id}>
                <MDBCard className="h-100">
                  <MDBCardBody>
                    <MDBCardTitle>{item.title}</MDBCardTitle>
                    <div className="d-flex justify-content-between mb-3">
                      <small className="text-muted">By {currentUser.username}</small>
                      <small className="text-muted">{item.created_at}</small>
                    </div>
                    <MDBCardText>{item.content.substring(0, 100)}...</MDBCardText>
                    <div className="mt-3 d-flex gap-2">
                      <MDBBtn color='primary' onClick={() => {
                        setDetailBlog(item);
                        setShowDetail(true);
                      }}>View Details</MDBBtn>

                      <MDBBtn color='warning' onClick={() => {
                        setUpdateForm({ id: item.id, title: item.title, content: item.content });
                        setShowUpdate(true);
                      }}>Update</MDBBtn>

                      <MDBBtn color='danger' onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this blog?')) return;
                        try {
                          const token = localStorage.getItem('token');
                          await axios.delete(`http://127.0.0.1:8000/api/manage/${item.id}/`, {
                            headers: { Authorization: `Token ${token}` }
                          });
                          setMyPosts(myPosts.filter(blog => blog.id !== item.id));
                        } catch (err) {
                          alert('Failed to delete blog');
                        }
                      }}>Delete</MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        )}
      </MDBContainer>

      <MDBModal open={showCreate} setOpen={setShowCreate} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create Blog</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setShowCreate(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput label='Title' value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} className="mb-3" />
              <div className='mb-3'>
                <label className='form-label'>Content</label>
                <textarea className='form-control' rows={6} value={createForm.content} onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}></textarea>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setShowCreate(false)}>Cancel</MDBBtn>
              <MDBBtn onClick={submitCreate} disabled={creating}>{creating ? 'Creating...' : 'Create'}</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal open={showDetail} setOpen={setShowDetail} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{detailBlog?.title}</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setShowDetail(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>{detailBlog?.content}</p>
              <small className="text-muted">By {currentUser.username} | {detailBlog?.created_at}</small>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setShowDetail(false)}>Close</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal open={showUpdate} setOpen={setShowUpdate} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Blog</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setShowUpdate(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label='Title'
                value={updateForm.title || ''}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                className="mb-3"
              />
              <div className='mb-3'>
                <label className='form-label'>Content</label>
                <textarea
                  className='form-control'
                  rows={6}
                  value={updateForm.content || ''}
                  onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                ></textarea>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setShowUpdate(false)}>Cancel</MDBBtn>
              <MDBBtn onClick={async () => {
                if (!updateForm.title.trim() || !updateForm.content.trim()) return;
                try {
                  setCreating(true);
                  const token = localStorage.getItem('token');
                  await axios.put(`http://127.0.0.1:8000/api/manage/${updateForm.id}/`, {
                    title: updateForm.title,
                    content: updateForm.content
                  }, { headers: { Authorization: `Token ${token}` } });

                  setMyPosts(myPosts.map(blog => blog.id === updateForm.id ? { ...blog, title: updateForm.title, content: updateForm.content } : blog));

                  if (detailBlog?.id === updateForm.id) {
                    setDetailBlog({ ...detailBlog, title: updateForm.title, content: updateForm.content });
                  }

                  setShowUpdate(false);
                } catch (err) {
                  alert('Failed to update blog');
                } finally {
                  setCreating(false);
                }
              }}>{creating ? 'Updating...' : 'Update'}</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default MyBlogs;
