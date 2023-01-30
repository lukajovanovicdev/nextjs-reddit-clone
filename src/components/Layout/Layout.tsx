import React, { FC, PropsWithChildren } from 'react';
import NavBar from '../NavBar/NavBar';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
