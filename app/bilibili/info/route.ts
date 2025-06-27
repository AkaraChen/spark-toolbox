import { getVideoInfo } from '@/modules/bilibili/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const params = new URL(request.url).searchParams
    const bvid = params.get('bvid')
    if (!bvid) {
        return NextResponse.json({ error: 'Missing bvid' }, { status: 400 })
    }
    const result = await getVideoInfo(bvid)
    return NextResponse.json(result)
}
