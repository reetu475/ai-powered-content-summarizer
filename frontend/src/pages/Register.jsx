import RegisterForm from '../components/auth/RegisterForm';
import './Auth.css';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-page-title">Create Account</h1>
        <p className="auth-page-subtitle">Sign up to start using AI summarizer</p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
