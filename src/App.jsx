import './App.css';
import ScrollToTop from './components/ScrollToTop';
import DefaultLayout from './layouts/DefaultLayout/index,';
import { Routes, Route } from 'react-router-dom'
import { adminRoutes, privateRoutes, publicRoutes } from "./routes/route";
import { Fragment } from 'react';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';


function App() {
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        {publicRoutes.map(
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
              <Route key={index} element={<ProtectedRoute />}>
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
