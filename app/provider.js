"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from 'react'

function Provider({children}) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

        return (
            <div>
                <ConvexProvider client={convex}>
                    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,currency:"USD" }}>
                    {children}
                     </PayPalScriptProvider>
                    </ConvexProvider>
            </div>
        )
    }

    export default Provider;