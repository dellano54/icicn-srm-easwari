import React, { useState, useMemo } from 'react';
import { LandingPage } from './components/LandingPage';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { PaymentPage } from './components/PaymentPage';
import { Footer } from './components/Footer';
import { FlowTracker } from './components/FlowTracker';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'register' | 'login' | 'dashboard' | 'payment'>('landing');
  const [user, setUser] = useState<{ teamName: string; country: string } | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  const navigateTo = (newView: typeof view) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (teamName: string, country: string) => {
    setUser({ teamName, country });
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setHasPaid(false); // Reset session state
    navigateTo('landing');
  };

  const handlePaymentComplete = () => {
    setHasPaid(true);
    navigateTo('dashboard');
  };

  // Calculate pricing based on user location
  const pricing = useMemo(() => {
    if (!user) return { currency: 'USD', symbol: '$', amount: 50 };
    
    // Check if country is India (case insensitive)
    if (user.country.toLowerCase() === 'india') {
        return { currency: 'INR', symbol: '₹', amount: 500 };
    }
    // Default to foreign pricing
    return { currency: 'USD', symbol: '$', amount: 50 };
  }, [user]);

  const showNav = view !== 'landing';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-500/30">
      {showNav && <FlowTracker currentView={view} hasPaid={hasPaid} />}
      
      <main className={`flex-grow transition-all duration-300 ${showNav ? 'lg:pl-72' : ''}`}>
        {view === 'landing' && (
          <LandingPage 
            onRegisterClick={() => navigateTo('login')} 
            onLoginClick={() => navigateTo('login')}
          />
        )}
        
        {view === 'register' && (
          <RegistrationPage 
            onBack={() => navigateTo('landing')} 
            onLogin={() => navigateTo('login')}
          />
        )}

        {view === 'login' && (
          <LoginPage 
            onBack={() => navigateTo('landing')} 
            onLoginSuccess={handleLoginSuccess}
            onRegisterStart={() => navigateTo('register')}
          />
        )}

        {view === 'dashboard' && user && (
          <DashboardPage 
            teamName={user.teamName} 
            onLogout={handleLogout}
            onProceedToPayment={() => navigateTo('payment')}
            hasPaid={hasPaid}
            feeAmount={pricing.amount}
            feeCurrency={pricing.currency}
            feeSymbol={pricing.symbol}
          />
        )}

        {view === 'payment' && user && (
          <PaymentPage
            teamName={user.teamName}
            onBack={() => navigateTo('dashboard')}
            onPaymentComplete={handlePaymentComplete}
            feeAmount={pricing.amount}
            feeCurrency={pricing.currency}
            feeSymbol={pricing.symbol}
          />
        )}
      </main>
      
      {/* Footer is visible on all pages except interactive dashboard flows for cleaner UX */}
      {view !== 'dashboard' && view !== 'payment' && view !== 'login' && (
         <div className={`${showNav ? 'lg:pl-72' : ''} transition-all duration-300`}>
            <Footer />
         </div>
      )}
    </div>
  );
};

export default App;