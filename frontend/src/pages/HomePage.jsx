import { Button, Form, Container, Row, Col, InputGroup, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from '../components/Layout/Footer'; 
import '../styles/HomePage.css';
import energyImage from '../assets/undraw_wind-turbine_4z2a.svg';
// import defaultLogo from '../assets/logo.jpg'; // Ensure you have a default logo
import { API_BASE_URL } from '../apiConfig';

// Validation schema using Yup
const schema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError(null); 

      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userId', userData.userId);
        navigate('/dashboard'); 
      } else {
        const errorData = await response.json();
        setServerError(errorData.message); 
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 bg-light d-flex flex-column">
      <Row className="flex-grow-1 align-items-center justify-content-center">
        <Col xs={12} md={6} className="d-none d-md-block">
          <div className="image-container d-flex justify-content-center align-items-center h-100">
            <img src={energyImage} alt="Welcome Graphic" className="img-fluid" />
          </div>
        </Col>
        
        <Col xs={12} md={6} lg={4} className="bg-white rounded shadow-lg p-4 text-center">
          {/* App Name and Logo */}
          {/* <Image src={defaultLogo} alt="Smart Home Energy Logo" fluid className="mb-3" style={{ maxHeight: '100px' }} /> */}
          <h2 className="mb-4">Smart Home Energy</h2>
          
          <h4 className="text-center mb-4">Welcome Back!</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formEmail" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  {...register('email')}
                  isInvalid={!!errors.email || !!serverError}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message || serverError}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  {...register('password')}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="mt-3 text-center">
              Don’t have an account?{' '}
              <Button variant="link" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </p>
          </Form>
        </Col>
      </Row>
      <Footer /> 
    </Container>
  );
};

export default HomePage;
