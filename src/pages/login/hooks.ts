import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { SERVER_URL } from '../../constants/config';

export const LOGIN_URL = '/api/auth/login';

export interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: LoginData) => login(email, password),
  });

const login = async (email: string, password: string) => {
  const { data } = await axios.post(
    `${SERVER_URL}${LOGIN_URL}`,
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return data;
};

/*
export const useAuthLogout = () => {
  const queryClient = useQueryClient();
  const setAuthStatus = useAuthUpdate();

  const { mutate } = useLogout({
    mutation: {
      onSuccess: () => {
        setAuthStatus((state) => {
          return { ...state, authStatus: null };
        });
        queryClient.cancelQueries();
      },
    },
  });

 */
