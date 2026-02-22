import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

// App shell + pages
import AppShell from '@/components/layout/AppShell'
import CreationPage from '@/pages/CreationPage'
import LibraryPage from '@/pages/LibraryPage'
import StudioPage from '@/pages/StudioPage'

// Billing pages
import PricingPage from '@/pages/billing/PricingPage'
import CheckoutPage from '@/pages/billing/CheckoutPage'

// Global billing modal
import CreditExhaustedModal from '@/components/billing/CreditExhaustedModal'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <>
      <Routes>
        {/* ── Auth routes ── */}
        <Route
          path="/auth/login"
          element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>}
        />
        <Route
          path="/auth/register"
          element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>}
        />
        <Route
          path="/auth/forgot-password"
          element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>}
        />
        <Route
          path="/auth/reset-password/:token?"
          element={<ResetPasswordPage />}
        />
        {/* Legacy /auth → redirect to login */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

        {/* ── Billing routes (protected) ── */}
        <Route
          path="/billing/pricing"
          element={<ProtectedRoute><PricingPage /></ProtectedRoute>}
        />
        <Route
          path="/billing/checkout"
          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
        />

        {/* ── App routes ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<CreationPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="studio/:projectId?" element={<StudioPage />} />
        </Route>

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global modals */}
      <CreditExhaustedModal />
    </>
  )
}
