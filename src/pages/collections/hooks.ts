import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'lodash';

import { CollectionData } from './types';
import { SERVER_URL } from '../../constants/config';
import { getToken } from '../../shared/utils/auth';

export const COLLECTIONS_URL = '/api/collections/partner/';
export const COLLECTIONS_CREATE_URL = '/api/collections';
export const COLLECTIONS_DELETE_URL = '/api/collections/';

export const useCollections = ({ label, tags, partnerId }: { label?: string; tags?: string[]; partnerId?: string }) => {
  return useQuery({
    queryKey: ['collections', { label, tags, partnerId }],
    queryFn: () => getCollections({ label, tags, partnerId }),
    enabled: !isNil(partnerId),
  });
};

const getCollections = async ({ label, tags, partnerId }: { label?: string; tags?: string[]; partnerId?: string }) => {
  const { data } = await axios.get(`${SERVER_URL}${COLLECTIONS_URL}${partnerId}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    params: {
      label,
      tags,
    },
  });
  return data;
};

export const useCreateCollection = () => {
  return useMutation({
    mutationFn: (formData: CollectionData) => uploadCollection(formData),
  });
};

const uploadCollection = async (formData: CollectionData) => {
  const response = await axios.post(`${SERVER_URL}${COLLECTIONS_CREATE_URL}`, formData, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

interface UpdateCollectionProps {
  formData: CollectionData;
  collectionId: string;
}

export const useUpdateCollection = () => {
  return useMutation({
    mutationFn: (props: UpdateCollectionProps) => updateCollection(props.formData, props.collectionId),
  });
};

const updateCollection = async (formData: CollectionData, collectionId: string) => {
  const response = await axios.patch(`${SERVER_URL}${COLLECTIONS_CREATE_URL}/${collectionId}`, formData, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const useDeleteCollection = () => {
  return useMutation({
    mutationFn: (collectionId: string) => deteleCollection(collectionId),
  });
};

const deteleCollection = async (collectionId: string) => {
  const response = await axios.delete(`${SERVER_URL}${COLLECTIONS_DELETE_URL}${collectionId}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};
