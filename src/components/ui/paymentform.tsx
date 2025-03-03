"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = ({ planType, onClose }: { planType: string; onClose: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement)!,
        });
  
        if (stripeError) {
          setError(stripeError.message || 'Payment failed');
          return;
        }
  
        const response = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            planType,
          }),
        });
  
        const data = await response.json();
  
        if (data.error) {
          setError(data.error);
        } else {
          // Handle successful subscription
          onClose();
          // Refresh subscription status
        }
      } catch  {
        setError('Payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border rounded-lg">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex space-x-4">
          <Button 
            type="submit" 
            disabled={!stripe || loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
          <Button 
            type="button" 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

export default PaymentForm