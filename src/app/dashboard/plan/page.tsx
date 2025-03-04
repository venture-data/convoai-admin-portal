"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";
import { Elements} from "@stripe/react-stripe-js";

import { Clock, CreditCard, Star } from "lucide-react";
import PaymentForm from "@/components/ui/paymentform";
import { useSubscription } from "@/app/hooks/use-subscription";

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'loading';
  planName?: string;
  nextBilling?: string;
  price?: string;
}


const stripePromise = loadStripe(String(process.env.PAYMENT_FORM));


export default function Page() {
  const { token, email } = useAuthStore();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    status: 'loading'
  });
  const {createSubscriptionIntent} = useSubscription()

  useEffect(() => {
    if (token) {
      setSubscription({
        status: 'active',
        planName: 'Professional Plan',
        nextBilling: '2024-04-01',
        price: '$19.99'
      });
    }
  }, [token, email]);

  const handleSubscribe = (planType: 'monthly' | 'yearly') => {
    if(planType === 'monthly'){
        try{
            const response =createSubscriptionIntent.mutate("hello")
            console.log(response)
            setSelectedPlan(planType);
            setShowPayment(true);
        }catch(e){
            console.error(e)
        }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-gray-500">Manage your subscription and billing details</p>
      </div>

      {showPayment && (
        <div className="fixed inset-0 min-h-screen flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Complete Your {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
            </h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                planType={selectedPlan!} 
                onClose={() => {
                  setShowPayment(false);
                  setSelectedPlan(null);
                }} 
              />
            </Elements>
          </div>
        </div>
      )}


      <div className="grid gap-8 md:grid-cols-2">
 
        <Card className="border-2 border-blue-100 hover:border-blue-500 transition-all">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Monthly Plan</CardTitle>
            <p className="text-gray-500">Perfect for short-term needs</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold text-blue-600">$19.99<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>All Premium Features</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Monthly Billing</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe('monthly')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Subscribe Monthly
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 hover:border-blue-500 transition-all">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Yearly Plan
              <span className="ml-2 text-sm font-normal text-green-500 bg-green-50 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </CardTitle>
            <p className="text-gray-500">Best value for long-term users</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold text-blue-600">
              $191.90<span className="text-lg text-gray-500">/year</span>
              <div className="text-sm text-green-500 font-normal">$15.99/month, billed annually</div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>All Premium Features</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>20% Discount</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe('yearly')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Subscribe Yearly
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
          <div className={subscription.status === 'active' ? 'bg-green-500 rounded-full w-4 h-4' : 'bg-yellow-500'}></div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Plan</span>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{subscription?.planName || 'No active plan'}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Price</span>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{subscription?.price || '-'}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Next Billing</span>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{subscription.nextBilling || '-'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-8 md:grid-cols-3">
        <Card className="p-2">
          <CardHeader>
            <CardTitle className="text-xl">Current Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-base">Unlimited AI Agents</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-base">Priority Support</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-base">API Access</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader>
            <CardTitle className="text-xl">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-base mb-2">
                  <span>AI Agents Used</span>
                  <span>8/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-base mb-2">
                  <span>API Calls</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader>
            <CardTitle className="text-xl">Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: 'Mar 1, 2024', amount: '$19.99' },
                { date: 'Feb 1, 2024', amount: '$19.99' },
                { date: 'Jan 1, 2024', amount: '$19.99' },
              ].map((invoice, index) => (
                <div key={index} className="flex justify-between items-center text-base py-1 border-b last:border-0">
                  <span className="text-gray-600">{invoice.date}</span>
                  <span className="font-medium">{invoice.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
