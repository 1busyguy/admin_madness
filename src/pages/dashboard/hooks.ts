import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { SERVER_URL } from '../../constants/config';
import { getToken } from '../../shared/utils/auth';

export const USER_STATS_URL = '/api/users/me/stats';

export interface UserStats {
  activationsCount: number;
  collectionsCount: number;
  totalActivationViews: number;
  totalActivationScans: number;
  totalCollectionViews: number;
}

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => getUserStats(),
  });
};

const getUserStats = async () => {
  const { data } = await axios.get(`${SERVER_URL}${USER_STATS_URL}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
  });
  return data as UserStats;
};
