"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/app/hooks/useAuth";


const PaymentForm = ({ planType, onClose }: { planType: string; onClose: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {data:session} = useSession()
    const { subscription,setSubscription } = useAuthStore();
    
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
            'Authorization': `Bearer ${session?.token}`
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            priceId: planType==="monthly"?"price_1QyTohDYRZVKrhUXDjLRpKPi":"price_1QyUgrDYRZVKrhUXhv4saXLP",
            planType,
            subscriptionId: subscription.subscriptionId || "",
            customerEmail: session?.user?.email,
            metadata: {
              email: session?.user?.email,
              upgrade: subscription.subscriptionId ? true : false,
            }
          }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.error) {
          setError(data.error);
        } else {
          // Check if this is a new subscription or an upgrade
          if (data.message.includes("scheduled for change")) {
            // Handle subscription upgrade
            const nextBillingDate = new Date(data.current_period_end * 1000)
              .toISOString()
              .split('T')[0];

            setSubscription({
              status: data.status,
              subscriptionId: data.subscription_id,
              customerId: data.customer_id,
              planName: planType === 'monthly' ? 'monthly' : 'yearly',
              price: planType === 'monthly' ? '$19.99' : '$191.90',
              nextBilling: nextBillingDate,
              // newPlanStarts: new Date(data.new_plan_starts * 1000).toISOString().split('T')[0]
            });
          } else {
            // Handle new subscription
            const { error: confirmationError } = await stripe.confirmCardPayment(data.client_secret);
            if (confirmationError) {
              setError(confirmationError.message || 'Payment confirmation failed');
              return;
            }

            const nextBillingDate = new Date(data.billing_details.current_period_end * 1000)
              .toISOString()
              .split('T')[0];

            const price = (data.payment_details.amount_due / 100).toFixed(2);

            setSubscription({
              status: data.status,
              subscriptionId: data.subscription_id,
              customerId: data.customer_id,
              planName: planType === 'monthly' ? 'Monthly Professional Plan' : 'Yearly Professional Plan',
              price: `$${price}`,
              nextBilling: nextBillingDate,
            });
          }
          
          onClose();
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