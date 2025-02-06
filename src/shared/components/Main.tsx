import React from 'react';

import { Outlet } from '@tanstack/react-location';

import { TopNavigation } from './TopNavigation';

export const Main = () => {
  return (
    <>
      <TopNavigation />
      <Outlet />
    </>
  );
};
