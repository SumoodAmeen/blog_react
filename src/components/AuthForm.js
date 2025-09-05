import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBCardFooter,
  MDBValidation,
  MDBValidationItem,
} from 'mdb-react-ui-kit';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formValue, setFormValue] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validated, setValidated] = useState(false);

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormValue({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    const { username, email, password, confirmPassword } = formValue;

    if (isLogin) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/login/", {
          email,
          password
        });
    
        console.log("Login success:", res.data);
    
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
    
        navigate("/");
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
    
        let errorMsg = "Invalid email or password!";
        if (err.response?.data) {
          const errors = err.response.data;
          if (typeof errors === "string") {
            errorMsg = errors;
          } else {
            errorMsg = Object.values(errors).flat().join("\n");
          }
        }
        alert(errorMsg);
      }
    

    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/register/", {
          username,
          email,
          password,
          ConfirmPassword: confirmPassword,
        });

        console.log("Registration success:", res.data);
        alert("Registration successful! Please login.");
        setIsLogin(true);

      } catch (err) {
        console.error("Registration failed:", err.response?.data || err.message);

        let errorMsg = "Registration failed!";
        if (err.response?.data) {
          const errors = err.response.data;
          if (typeof errors === "string") {
            errorMsg = errors;
          } else {
            errorMsg = Object.values(errors).flat().join("\n");
          }
        }
        alert(errorMsg);
      }
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image'
      style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px', width: '90%' }}>
        <MDBValidation onSubmit={handleSubmit} className='row g-3' noValidate validated={validated ? 'validated' : ''}>
          <MDBCardBody className='px-5'>
            <h2 className="text-uppercase text-center mb-5">
              {isLogin ? 'Login to your account' : 'Create an account'}
            </h2>

            {!isLogin && (
              <MDBValidationItem feedback='Please provide a username' invalid>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Username'
                  size='lg'
                  type='text'
                  name='username'
                  value={formValue.username}
                  onChange={onChange}
                  required
                />
              </MDBValidationItem>
            )}

            <MDBValidationItem feedback='Please provide a valid email' invalid>
              <MDBInput
                wrapperClass='mb-4'
                label='Your Email'
                size='lg'
                type='email'
                name='email'
                value={formValue.email}
                onChange={onChange}
                required
              />
            </MDBValidationItem>

            <MDBValidationItem feedback='Please provide a password' invalid>
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                size='lg'
                type='password'
                name='password'
                value={formValue.password}
                onChange={onChange}
                required
              />
            </MDBValidationItem>

            {!isLogin && (
              <MDBValidationItem feedback='Please confirm your password' invalid>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Confirm Password'
                  size='lg'
                  type='password'
                  name='confirmPassword'
                  value={formValue.confirmPassword}
                  onChange={onChange}
                  required
                />
              </MDBValidationItem>
            )}

            {isLogin && (
              <div className='d-flex justify-content-between mx-4 mb-4'>
                <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='Remember me' />
                <a href="#!">Forgot password?</a>
              </div>
            )}

            <MDBBtn type='submit' className='mb-4 w-100 gradient-custom-4' size='lg'>
              {isLogin ? 'Login' : 'Register'}
            </MDBBtn>
          </MDBCardBody>

          <MDBCardFooter>
            <div className='d-flex justify-content-center'>
              <p className='text-center fw-bold mx-3 mb-0'>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a href="#!" className="link-danger" onClick={toggleForm}>
                  {isLogin ? 'Register here' : 'Login here'}
                </a>
              </p>
            </div>
          </MDBCardFooter>
        </MDBValidation>
      </MDBCard>
    </MDBContainer>
  );
}

export default AuthForm;