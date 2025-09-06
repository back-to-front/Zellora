import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
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

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

      await register(formData.username, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <Card className='auth-card'>
          <h1 className='auth-title'>Create an Account</h1>

          {error && <Alert variant='danger'>{error}</Alert>}

          <form className='auth-form' onSubmit={handleSubmit}>
            <Input
              label='Username'
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Choose a username'
              error={errors.username}
              required
            />

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
                placeholder='Create a password'
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

            <Input
              label='Confirm Password'
              type={showPassword ? "text" : "password"}
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm your password'
              error={errors.confirmPassword}
              required
            />

            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={submitting}
            >
              {submitting ? (
                "Creating Account..."
              ) : (
                <>
                  <FaUserPlus /> Register
                </>
              )}
            </Button>
          </form>

          <div className='auth-links'>
            <p>
              Already have an account? <Link to='/login'>Login</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
