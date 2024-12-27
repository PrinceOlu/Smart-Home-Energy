import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './styles/HomePage.css';

// Validation schema using Yup
const schema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const HomePage = () => {
  // React Hook Form setup
  const {
    register, // Binds inputs to the form
    handleSubmit, // Handles form submission
    formState: { errors }, // Tracks validation errors
  } = useForm({
    resolver: yupResolver(schema), // Integrate Yup for validation
  });

  // Form submission handler
  const onSubmit = (data) => {
    console.log('Form Data:', data); // Handle API call here
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} className="p-4 bg-white rounded shadow-lg">
          <h2 className="text-center mb-4">Welcome Back!</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register('email')} 
                isInvalid={!!errors.email} // Display error state if invalid
              />
              {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                {...register('password')} 
                isInvalid={!!errors.password} // Display error state if invalid
              />
              {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
            </Form.Group>

            <div className="d-flex justify-content-between mb-3">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="/forgot-password" className="text-muted">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>

            {/* Sign Up Link */}
            <Button variant="link" href="/signup" className="w-100 text-center text-decoration-none text-primary">
              Don`t have an account? Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
