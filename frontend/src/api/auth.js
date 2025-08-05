const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export const login = async (email, password) => {
  const response = await fetch(`${AUTH_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return response.json();
};

//Register
export const register = async (email, password, role, name) => {
  const response = await fetch(`${AUTH_URL}/api/Auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      Name: name, 
      Email: email, 
      Password: password, 
      Role: role 
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al registrarse');
  }

  return response.json();
};

