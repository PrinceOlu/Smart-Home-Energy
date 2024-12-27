import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import '../styles/HomePage.css';
import energyImage from '../assets/undraw_wind-turbine_4z2a.svg';
import { useNavigate } from 'react-router-dom';

// Validation schema using Yup
const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('User registered successfully!');
        navigate('/');
      } else {
        alert('Error registering user. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100 align-items-center justify-content-center">
        {/* Left Image */}
        <Col xs={12} md={6} lg={6} className="d-none d-md-block">
          <div className="image-container h-100 d-flex justify-content-center align-items-center">
            <img
              src={energyImage}
              alt="Welcome Graphic"
              className="img-fluid"
            />
          </div>
        </Col>

        {/* Right Form */}
        <Col
          xs={12}
          md={6}
          lg={4}
          className="p-4 bg-white rounded shadow-lg d-flex flex-column justify-content-center"
        >
          <h2 className="text-center mb-4">Create an Account!</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                {...register('name')}
                isInvalid={!!errors.name}
              />
              {errors.name && (
                <Form.Text className="text-danger">
                  {errors.name.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                isInvalid={!!errors.password}
              />
              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between mb-3">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="/forgot-password" className="text-muted">
                Forgot password?
              </a>
            </div>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Sign Up
            </Button>

            <Button
              variant="link"
              href="/"
              className="w-100 text-center text-decoration-none text-primary"
            >
              Already have an account? Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
