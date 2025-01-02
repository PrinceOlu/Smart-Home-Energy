import { Button, Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/HomePage.css';
import energyImage from '../assets/undraw_wind-turbine_4z2a.svg';

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
      setServerError(null); // Reset server error state
      const response = await fetch('http://localhost:5000/api/users/login', {
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
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100 align-items-center justify-content-center">
        <Col xs={12} md={6} className="d-none d-md-block">
          <div className="image-container d-flex justify-content-center align-items-center h-100">
            <img src={energyImage} alt="Welcome Graphic" className="img-fluid" />
          </div>
        </Col>
        <Col xs={12} md={6} lg={4} className="bg-white rounded shadow-lg p-4">
          <h2 className="text-center mb-4">Welcome Back!</h2>
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
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
