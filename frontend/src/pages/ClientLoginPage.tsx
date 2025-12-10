import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { api } from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';
import { useAuth } from '../context/AuthContext';

const ClientLoginPage = () => {
  const navigate = useNavigate();
  const { loginCliente } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/clientes/login', { nome, telefone });
      const data = res.data;
      loginCliente({ id: data.id, nome: data.nome, telefone: data.telefone });
      navigate('/agendar');
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao fazer login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-md gap-4 px-4 py-8">
      <Card
        title="Login"
        subtitle="Informe nome completo e telefone para acessar seus agendamentos."
      >
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Input
            label="Nome completo"
            placeholder="Ex: João da Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </Card>
    </div>
  );
};

export default ClientLoginPage;
