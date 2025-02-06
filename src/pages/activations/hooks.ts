import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'lodash';

import { ActivationData } from './types';
import { SERVER_URL } from '../../constants/config';
import { Activation } from '../../shared/types';
import { getToken } from '../../shared/utils/auth';

export const ACTIVATIONS_URL = '/api/activations/partner/';
export const ACTIVATIONS_CREATE_URL = '/api/activations';
export const ACTIVATIONS_DELETE_URL = '/api/activations/id/';
export const ACTIVATIONS_UPDATE_URL = '/api/activations/id/';
export const ACTIVATIONS_DETAIL_URL = '/api/activations/id/';

export const useActivations = ({ partnerId }: { partnerId?: string }) => {
  return useQuery({
    queryKey: ['activations', { partnerId }],
    queryFn: () => getActivations({ partnerId }),
    enabled: !isNil(partnerId),
  });
};

const getActivations = async ({ partnerId }: { partnerId?: string }) => {
  const { data } = await axios.get<Activation[]>(`${SERVER_URL}${ACTIVATIONS_URL}${partnerId}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });
  return data;
};

export const useCreateActivation = () => {
  return useMutation({
    mutationFn: (formData: ActivationData) => createActivation(formData),
  });
};

const createActivation = async (formData: ActivationData) => {
  const response = await axios.post(`${SERVER_URL}${ACTIVATIONS_CREATE_URL}`, formData, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useDeleteActivation = () => {
  return useMutation({
    mutationFn: (activationId: string) => deleteActivation(activationId),
  });
};

const deleteActivation = async (activationId: string) => {
  const response = await axios.delete(`${SERVER_URL}${ACTIVATIONS_DELETE_URL}${activationId}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useActivation = (activationId: string) => {
  return useQuery({
    queryKey: ['activation', { activationId }],
    queryFn: () => getActivation(activationId),
    enabled: !isNil(activationId),
  });
};

const getActivation = async (activationId: string) => {
  const { data } = await axios.get<Activation>(`${SERVER_URL}${ACTIVATIONS_DETAIL_URL}${activationId}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });
  return data;
};

interface UpdateActivationParams {
  formData: ActivationData;
  activationId: string;
}

export const useUpdateActivation = () => {
  return useMutation({
    mutationFn: (props: UpdateActivationParams) => updateActivation(props.activationId, props.formData),
  });
};

const updateActivation = async (activationId: string, formData: ActivationData) => {
  const response = await axios.patch(`${SERVER_URL}${ACTIVATIONS_UPDATE_URL}${activationId}`, formData, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};
