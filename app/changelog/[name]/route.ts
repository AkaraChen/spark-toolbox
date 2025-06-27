import { NextRequest, NextResponse } from 'next/server'
import { getChangelogInfo } from '@/modules/changelog/api'
import { ChangelogResult } from '@/modules/changelog/types'
import { z } from 'zod'

export async function POST(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    const schema = z.object({
        githubToken: z.string().optional(),
    })

    const { name } = await params
    const { githubToken } = schema.parse(await request.json())
    
    try {
        const result = (await getChangelogInfo(
            name,
            githubToken
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
