import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Preencha email e senha para continuar.');
      return;
    }

    const ok = await login(email, password);
    if (!ok) {
      setError('Credenciais inválidas para este ambiente simulado.');
      return;
    }

    navigate('/dashboard');
  };

  const showRequiredError = touched && (!email.trim() || !password.trim());

  return (
    <section className="login-page">
      <div className="card login-card">
        <header className="login-header">
          <h2 className="login-title">Acesso ao experimento</h2>
          <p className="login-subtitle">
            Use qualquer combinação de email e senha. Os dados são simulados e usados apenas para este estudo.
          </p>
        </header>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          {showRequiredError && (
            <p className="form-error">Email e senha são obrigatórios.</p>
          )}
          {error && !showRequiredError && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="app-button">
              Entrar
            </button>
          </div>
          <p className="muted-text">
            Esta tela de login é apenas uma simulação para o fluxo experimental. Nenhuma informação real é enviada para
            servidores.
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;

