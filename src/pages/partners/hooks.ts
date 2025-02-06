import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { SERVER_URL } from '../../constants/config';
import { CreatePartner, CreateUser, Partner, PartnerData } from '../../shared/types';
import { getToken } from '../../shared/utils/auth';

export const PARTNERS_URL = '/api/partners';

export const usePartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(),
  });
};

const getPartners = async () => {
  const { data } = await axios.get<Partner[]>(`${SERVER_URL}${PARTNERS_URL}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
};

export const useCreatePartner = () => {
  return useMutation({
    mutationFn: (data: CreatePartner) => createPartner(data),
  });
};

const createPartner = async (data: CreatePartner) => {
  const response = await axios.post(`${SERVER_URL}${PARTNERS_URL}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useDeletePartner = () => {
  return useMutation({
    mutationFn: (id: string) => deletePartner(id),
  });
};

const deletePartner = async (id: string) => {
  const response = await axios.delete(`${SERVER_URL}${PARTNERS_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export interface UpdatePartnerProps {
  partnerData: PartnerData;
  id: string;
}

export const useUpdatePartner = () => {
  return useMutation({
    mutationFn: ({ id, partnerData }: UpdatePartnerProps) => updatePartner(id, partnerData),
  });
};

const updatePartner = async (id: string, data: PartnerData) => {
  const response = await axios.patch(`${SERVER_URL}${PARTNERS_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useAddUserToPartner = () => {
  return useMutation({
    mutationFn: (data: { partnerId: string; user: CreateUser }) =>
      addUserToPartner(data.partnerId, { ...data.user, partner: data.partnerId }),
  });
};

const addUserToPartner = async (partnerId: string, user: CreateUser) => {
  const response = await axios.post(`${SERVER_URL}${PARTNERS_URL}/${partnerId}/users`, user, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};
