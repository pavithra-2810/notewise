"use client";

import React from "react";
import { api } from "@/convex/_generated/api";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import {toast} from 'sonner';
import { useUser } from "@clerk/nextjs";

function UpgradePlans() {
  const upgradeuserPlan=useMutation(api.user.userUpgradePlan);
  const {user}=useUser();
  const onPaymentSuccess = async() => {
    const result=await upgradeuserPlan({userEmail:user?.primaryEmailAddress.emailAddress})
    console.log(result);
    toast('Plan upgraded successfully')
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Plans</h2>
        <p className="mt-2 text-center text-gray-600">
          Update your plan to upload more PDFs and take notes efficiently
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          
          {/* Free Plan */}
          <div className="rounded-2xl bg-white text-gray-900 border border-gray-200 p-6 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-indigo-400">
            <h2 className="text-xl font-semibold text-center">Free</h2>
            <p className="mt-2 text-center text-2xl font-bold">Free</p>

            <ul className="mt-6 space-y-2 text-left">
              {["1 user included", "500MB storage", "Email support"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-green-500">✅</span> {item}
                </li>
              ))}
            </ul>

            <button className="mt-8 w-full rounded-full border border-gray-400 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition duration-300">
              Current Plan
            </button>
          </div>

          {/* Unlimited Plan */}
          <div className="rounded-2xl bg-white text-gray-900 border border-gray-200 p-6 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-indigo-400">
            <h2 className="text-xl font-semibold text-center">Unlimited</h2>
            <p className="mt-2 text-center text-2xl font-bold">$30 /month</p>

            <ul className="mt-6 space-y-2 text-left">
              {["20 users included", "5GB of storage", "Priority support", "Phone & Email support"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-green-500">✅</span> {item}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: "30.00",currency_code:"USD" } // must be string
                      }
                    ]
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  onPaymentSuccess(details);
                }}
                onCancel={() => console.log("Payment cancelled")}
                onError={(err) => console.error("PayPal Error:", err)}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UpgradePlans;
