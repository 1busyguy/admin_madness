import { Navigate, Route } from '@tanstack/react-location';

import { ActivationPage } from './pages/activations/ActivationPage';
import { Activations } from './pages/activations/Activations';
import { ActivationsPage } from './pages/activations/ActivationsPage';
import { CollectionPage } from './pages/collections/CollectionPage';
import { Collections } from './pages/collections/Collections';
import { CollectionsPage } from './pages/collections/CollectionsPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { LoginPage } from './pages/login/LoginPage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';
import { PartnersPage } from './pages/partners/PartnersPage';
import { Main } from './shared/components/Main';
import { VIEW_MODE } from './shared/constants';
import { findPath } from './shared/utils';

export const rootUrl = '/';
export const loginUrl = '/login';
export const appUrl = '/app';
export const dashboardUrl = '/app/dashboard';
export const collectionsUrl = '/app/collections';
export const createCollectionUrl = '/app/collections/create';
export const editCollectionUrl = '/app/collections/edit/:collectionId';
export const editCollectionPath = (id: string) => `/app/collections/edit/${id}`;
export const activationsUrl = '/app/activations';
export const createActivationUrl = '/app/activations/create';
export const editActivationUrl = '/app/activations/edit/:activationId';
export const editActivationPath = (id: string) => `/app/activations/edit/${id}`;
export const partnersUrl = '/app/partners';
export const unknownUrl = '*';

export const routes: Route[] = [
  {
    path: rootUrl,
    element: <Navigate to={findPath(rootUrl, loginUrl)} replace={true} hash />,
  },
  {
    path: loginUrl,
    element: <LoginPage />,
  },
  {
    path: appUrl,
    element: <Main />,
    children: [
      {
        path: rootUrl,
        element: <Navigate to={findPath(appUrl, dashboardUrl)} replace={true} hash />,
      },
      {
        path: findPath(appUrl, dashboardUrl),
        element: <DashboardPage />,
      },
      {
        path: findPath(appUrl, collectionsUrl),
        element: <Collections />,
        children: [
          {
            path: rootUrl,
            element: <CollectionsPage />,
          },
          {
            path: findPath(collectionsUrl, createCollectionUrl),
            element: <CollectionPage viewMode={VIEW_MODE.CREATE} />,
          },
          {
            path: findPath(collectionsUrl, editCollectionUrl),
            element: <CollectionPage viewMode={VIEW_MODE.UPDATE} />,
          },
        ],
      },
      {
        path: findPath(appUrl, activationsUrl),
        element: <Activations />,
        children: [
          {
            path: rootUrl,
            element: <ActivationsPage />,
          },
          {
            path: findPath(activationsUrl, createActivationUrl),
            element: <ActivationPage viewMode={VIEW_MODE.CREATE} />,
          },
          {
            path: findPath(activationsUrl, editActivationUrl),
            element: <ActivationPage viewMode={VIEW_MODE.UPDATE} />,
          },
        ],
      },
      {
        path: findPath(appUrl, partnersUrl),
        element: <PartnersPage />,
      },
      {
        path: findPath(appUrl, unknownUrl),
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: unknownUrl,
    element: <NotFoundPage />,
  },
];
