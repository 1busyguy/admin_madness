import { useEffect } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { User } from './types';
import { SERVER_URL } from '../constants/config';
import { getToken } from './utils/auth';

export const UPLOAD_URL = '/api/upload';
export const USER_URL = '/api/users/me';

export interface UploadImageResponse {
  url: string;
  message: string;
}

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  });
};

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post(`${SERVER_URL}${UPLOAD_URL}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
};

export const usePartnerStats = (partnerId: string | undefined) => {
  return useQuery({
    queryKey: ['partnerStats', { partnerId }],
    queryFn: () => getPartnerStats(partnerId ?? ''),
    enabled: !!partnerId,
  });
};

const getPartnerStats = async (partnerId: string) => {
  const { data } = await axios.get(`${SERVER_URL}/api/partners/${partnerId}/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
};

export const useGetUserData = () => {
  return useQuery({
    queryKey: ['useGetUserData'],
    queryFn: () => getUserData(),
  });
};

const getUserData = async () => {
  const { data } = await axios.get<User>(`${SERVER_URL}${USER_URL}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
};

export const useDelayedEffect = (methodToRun: () => void, value: any, delay: number) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      methodToRun();
    }, delay);

    return () => clearTimeout(timer); // Cleanup on dependency change
  }, [value, delay, methodToRun]);
};
