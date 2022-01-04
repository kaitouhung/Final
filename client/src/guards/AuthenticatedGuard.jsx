import React, { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { path } from 'src/constants/path';
import { useAuthenticated } from 'src/hooks/useAuthenticated';

export default function AuthenticatedGuard({ children }) {
  const authenticated = useAuthenticated();

  if (!authenticated) {
    return <Navigate to={path.login} />;
  }

  return <Fragment>{children}</Fragment>;
}
