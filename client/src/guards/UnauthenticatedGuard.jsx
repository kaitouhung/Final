import React, { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { path } from 'src/constants/path';
import { useAuthenticated } from 'src/hooks/useAuthenticated';

export default function UnauthenticatedGuard({ children }) {
  const authenticated = useAuthenticated();

  if (authenticated) {
    return <Navigate to={path.home} />;
  }

  return <Fragment>{children}</Fragment>;
}
