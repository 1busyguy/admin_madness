import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { SERVER_URL } from '../../constants/config';
import { CreateUser } from '../../shared/types';
import { getToken } from '../../shared/utils/auth';

export const USERS_URL = '/api/users';

export const useAddUser = () => {
  return useMutation({
    mutationFn: (data: CreateUser) => addUser(data),
  });
};

const addUser = async (data: CreateUser) => {
  const response = await axios.post(`${SERVER_URL}${USERS_URL}`, data, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateUser }) => updateUser(userId, data),
  });
};

const updateUser = async (id: string, data: CreateUser) => {
  const response = await axios.patch(`${SERVER_URL}${USERS_URL}/${id}`, data, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
  });
};

const deleteUser = async (id: string) => {
  await axios.delete(`${SERVER_URL}${USERS_URL}/${id}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });
};
