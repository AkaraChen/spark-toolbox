import { NextRequest, NextResponse } from 'next/server'
import { getChangelogInfo } from '@/modules/changelog/api'
import { z } from 'zod'
import { ChangelogResult } from '@/modules/changelog/types'

export async function POST(request: NextRequest) {
    const schema = z.object({
        packageName: z.string(),
        githubToken: z.string().optional(),
    })
    
    try {
        const { packageName, githubToken } = schema.parse(await request.json())
        const result = (await getChangelogInfo(
            packageName,
            githubToken,
        )) satisfies ChangelogResult
        
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error processing changelog request:', error)
        return NextResponse.json(
            { error: 'Failed to get changelog information' },
            { status: 500 }
        )
    }
}
