import LoginForm from '../components/auth/LoginForm';
import './Auth.css';

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-page-title">Welcome Back</h1>
        <p className="auth-page-subtitle">Login to access your AI summarizer</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
