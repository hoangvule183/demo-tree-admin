"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:3002";

export const dataProvider = dataProviderSimpleRest(API_URL);
