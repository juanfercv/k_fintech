import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    correo_electronico_Dueño: '',
    password_Dueño: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.correo_electronico_Dueño, formData.password_Dueño);
      // Redirigir al dashboard después del inicio de sesión exitoso
      navigate('/dashboard');
    } catch (error) {
      setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      console.error('Error en el inicio de sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo_electronico_Dueño">Correo Electrónico:</label>
            <input
              type="email"
              id="correo_electronico_Dueño"
              name="correo_electronico_Dueño"
              value={formData.correo_electronico_Dueño}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password_Dueño">Contraseña:</label>
            <input
              type="password"
              id="password_Dueño"
              name="password_Dueño"
              value={formData.password_Dueño}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="auth-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;