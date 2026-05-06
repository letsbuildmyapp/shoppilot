import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Tutorial } from '@/components/Tutorial';
import { ConfirmProvider } from '@/components/ConfirmModal';
import { useAuth } from '@/store/auth';
import { ensureSeed } from '@/seed/runSeed';

import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductPage from '@/pages/Product';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import SignIn from '@/pages/SignIn';
import Account from '@/pages/Account';
import { Orders, OrderDetail } from '@/pages/Orders';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function AuthBoot({ children }: { children: React.ReactNode }) {
  const init = useAuth((s) => s.init);
  const user = useAuth((s) => s.user);
  useEffect(() => {
    const unsub = init();
    return () => unsub();
  }, [init]);
  return (
    <>
      {children}
      {user ? <Tutorial /> : null}
    </>
  );
}

export default function App() {
  useEffect(() => {
    ensureSeed().catch((e) => console.warn('seed failed', e));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <BrowserRouter>
          <AuthBoot>
            <Toaster
              position="top-center"
              toastOptions={{ className: '!font-sans !rounded-none !border !border-line' }}
            />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="p/:slug" element={<ProductPage />} />
                <Route path="cart" element={<Cart />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="about" element={<About />} />
                <Route path="order/success" element={<OrderSuccess />} />

                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="admin" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
                <Route path="admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthBoot>
        </BrowserRouter>
      </ConfirmProvider>
    </QueryClientProvider>
  );
}
