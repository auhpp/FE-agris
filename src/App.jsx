import './App.css';
import ScrollToTop from './components/ScrollToTop';
import DefaultLayout from './layouts/DefaultLayout/index,';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { adminRoutes, privateRoutes, publicRoutes } from "./routes/route";
import { Fragment, useContext } from 'react';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import { routes } from './config/routes';
import { AuthContext } from './context/AuthContext';
import RedirectIfLoggedIn from './routes/RedirectIfLoggedIn';


function App() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate()
  return (
    <>
      <ScrollToTop />
      <Routes>
        {publicRoutes.map(
          (item, index) => {
            if (item.path == routes.login || item.path == routes.register || item.path === routes.resetPassword) {
              if (token) {
                return <Route
                  key={index}
                  index={index}
                  path={item.path}
                  element={<RedirectIfLoggedIn path={item.path} />} />
              }
            }
            var Page = item.page;
            var Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            }
            else if (item.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                index={index}
                path={item.path}
                element={<Layout><Page /></Layout>}
              />
            );
          }
        )}

        {privateRoutes.map(
          (item, index) => {
            var Page = item.page;
            var Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            }
            else if (item.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route key={index} element={<ProtectedRoute path={item.path} />}>
                <Route path={item.path} element={<Layout><Page /></Layout>} />
              </Route>
            );
          }
        )}

        {adminRoutes.map(
          (item, index) => {
            var Page = item.page;
            var Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            }
            else if (item.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route key={index} element={<AdminRoute />}>
                <Route path={item.path} element={<Layout><Page /></Layout>} />
              </Route>
            );
          }
        )}
      </Routes>
    </>
  );
}

export default App;
