import { NextRequest, NextResponse } from "next/server";
import { getProviderQuota } from "@/modules/one-api/api";
import { z } from "zod";

export interface Quota {
    quotaPerUnit: number;
    quota: number;
    unitCount: number;
}

export async function POST(request: NextRequest) {

const schema = z.object({
    baseURL: z.string(),
    token: z.string(),
    userId: z.number().optional(),
});
    const { baseURL, token, userId } = schema.parse(await request.json());
    const quota = await getProviderQuota(baseURL, token, userId) satisfies Quota;
    return NextResponse.json(quota);
}
