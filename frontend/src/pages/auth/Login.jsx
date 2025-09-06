import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError("");

      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <Card className='auth-card'>
          <h1 className='auth-title'>Login to Your Account</h1>

          {error && <Alert variant='danger'>{error}</Alert>}

          <form className='auth-form' onSubmit={handleSubmit}>
            <Input
              label='Email'
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              error={errors.email}
              required
            />

            <div className='password-field'>
              <Input
                label='Password'
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                error={errors.password}
                required
              />
              <button
                type='button'
                className='password-toggle'
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={submitting}
            >
              {submitting ? (
                "Logging in..."
              ) : (
                <>
                  <FaSignInAlt /> Login
                </>
              )}
            </Button>
          </form>

          <div className='auth-links'>
            <p>
              Don't have an account? <Link to='/register'>Sign up</Link>
            </p>
            <p>
              <Link to='/forgot-password'>Forgot password?</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
