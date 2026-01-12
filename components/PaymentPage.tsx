import React, { useState } from 'react';
import { InputField } from './InputField';

interface PaymentPageProps {
  onBack: () => void;
  onPaymentComplete: () => void;
  teamName: string;
  feeAmount: number;
  feeCurrency: string;
  feeSymbol: string;
}

type PaymentMethod = 'card' | 'netbanking' | 'upi' | 'paypal';

export const PaymentPage: React.FC<PaymentPageProps> = ({ 
    onBack, 
    onPaymentComplete, 
    teamName,
    feeAmount,
    feeCurrency,
    feeSymbol
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  
  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('');
  
  // UPI State
  const [upiId, setUpiId] = useState('');

  // General State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Format card number with spaces
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = value.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API Payment Processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 text-center animate-fade-in-up border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
           <p className="text-slate-500 mb-8">
             Your registration for ICICN '26 is confirmed. A receipt has been sent to your email.
           </p>
           
           <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left text-sm border border-slate-100">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-slate-700">TXN-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-bold text-slate-800">{feeSymbol}{feeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="text-slate-700 capitalize">{paymentMethod === 'netbanking' ? 'Net Banking' : paymentMethod.toUpperCase()}</span>
              </div>
           </div>

           <button 
             onClick={onPaymentComplete}
             className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
           >
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank"
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </span>
          Cancel Payment
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Payment Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
             <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                   <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                   Checkout
                </h2>
                <div className="text-sm font-bold text-slate-400">
                    {feeCurrency}
                </div>
             </div>

             {/* Payment Method Selector */}
             <div className="px-8 pt-6 pb-2">
                 <div className="grid grid-cols-4 gap-2 p-1 bg-slate-100 rounded-xl">
                     <button 
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Card
                     </button>
                     <button 
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${paymentMethod === 'netbanking' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Net Banking
                     </button>
                     <button 
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        UPI
                     </button>
                     <button 
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${paymentMethod === 'paypal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        PayPal
                     </button>
                 </div>
             </div>
             
             <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* --- CREDIT CARD FORM --- */}
                    {paymentMethod === 'card' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-400">VISA</div>
                                <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-400">MC</div>
                                <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-400">AMEX</div>
                            </div>
                            <InputField
                                label="Cardholder Name"
                                placeholder="Name on card"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            
                            <InputField
                                label="Card Number"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={handleCardChange}
                                maxLength={19}
                                required
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>}
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <InputField
                                    label="Expiration Date"
                                    placeholder="MM / YY"
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                    required
                                />
                                <InputField
                                    label="CVC"
                                    placeholder="123"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                    maxLength={4}
                                    required
                                    type="password"
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- NET BANKING FORM --- */}
                    {paymentMethod === 'netbanking' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                                <p className="text-sm text-blue-800">Select your bank to proceed with secure Net Banking transaction.</p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Select Bank <span className="text-blue-500">*</span></label>
                                <select 
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none text-slate-700"
                                >
                                    <option value="" disabled>Choose a bank</option>
                                    {banks.map((bank) => (
                                        <option key={bank} value={bank}>{bank}</option>
                                    ))}
                                    <option value="other">Other Banks</option>
                                </select>
                            </div>

                            <div className="text-xs text-slate-500 text-center">
                                You will be redirected to your bank's website to complete the payment.
                            </div>
                        </div>
                    )}

                    {/* --- UPI FORM --- */}
                    {paymentMethod === 'upi' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-around mb-4 grayscale opacity-70">
                                {/* Mock Icons for UPI Apps */}
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold">GPay</div>
                                    <span className="text-[10px]">Google Pay</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold">Pe</div>
                                    <span className="text-[10px]">PhonePe</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold">Paytm</div>
                                    <span className="text-[10px]">Paytm</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold">BHIM</div>
                                    <span className="text-[10px]">BHIM</span>
                                </div>
                            </div>

                            <InputField
                                label="UPI ID / VPA"
                                placeholder="username@bank"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                required
                                helperText="Enter your Virtual Payment Address (e.g. 9876543210@upi)"
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>}
                            />
                            
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase">OR</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <button type="button" className="w-full py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                Generate QR Code
                            </button>
                        </div>
                    )}

                    {/* --- PAYPAL FORM --- */}
                    {paymentMethod === 'paypal' && (
                        <div className="space-y-6 animate-fade-in text-center py-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-700 italic">P</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Pay with PayPal</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                You will be redirected to PayPal's secure website to complete the payment. You can pay with your credit card if you don't have a PayPal account.
                            </p>
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800 text-left mx-auto max-w-sm">
                                <strong>Note for international customers:</strong> Currency conversion fees may apply depending on your bank.
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100">
                        {paymentMethod !== 'paypal' && (
                            <div className="flex items-start mb-6">
                                <input id="terms" type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" required />
                                <label htmlFor="terms" className="ml-2 text-sm text-slate-500">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Refund Policy</a>.
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-70 flex items-center justify-center
                                ${paymentMethod === 'paypal' 
                                    ? 'bg-[#0070BA] shadow-blue-500/30' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30'
                                }`}
                        >
                            {isProcessing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                paymentMethod === 'paypal' ? "Proceed to PayPal" : `Pay ${feeSymbol}${feeAmount.toFixed(2)}`
                            )}
                        </button>
                    </div>
                </form>
             </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-slate-900 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>

                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8 border-b border-slate-700 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-bold text-lg">Author Registration</div>
                            <div className="text-slate-400 text-sm">Paper ID: ICICN-26-4592</div>
                            <div className="text-slate-400 text-sm mt-1">{teamName}</div>
                        </div>
                        <div className="font-bold text-lg">{feeSymbol}{feeAmount.toFixed(2)}</div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                    <span>Subtotal</span>
                    <span>{feeSymbol}{feeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-400 mb-6">
                    <span>Processing Fee</span>
                    <span>{feeSymbol}0.00</span>
                </div>
                
                <div className="flex justify-between items-center font-bold text-2xl pt-4 border-t border-slate-700">
                    <span>Total</span>
                    <span>{feeSymbol}{feeAmount.toFixed(2)}</span>
                </div>
             </div>

             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                 <div className="flex items-start">
                     <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-800 text-sm mb-1">Payment Information</h4>
                         <p className="text-xs text-slate-500 leading-relaxed">
                             Registration confirms your presentation slot. This payment is non-refundable 30 days prior to the conference date.
                         </p>
                     </div>
                 </div>
             </div>
             
             {/* Security Badges */}
             <div className="flex justify-center space-x-4 opacity-50 grayscale">
                 <div className="h-8 flex items-center font-bold text-slate-400 text-xs border border-slate-200 px-2 rounded">SSL SECURE</div>
                 <div className="h-8 flex items-center font-bold text-slate-400 text-xs border border-slate-200 px-2 rounded">256-BIT ENCRYPTION</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};