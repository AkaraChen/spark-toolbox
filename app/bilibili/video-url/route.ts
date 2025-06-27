import { getVideoSourceUrl } from '@/modules/bilibili/api/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const params = new URL(request.url).searchParams
    const bvid = params.get('bvid')
    const cid = params.get('cid')
    if (!bvid || !cid) {
        return NextResponse.json(
            { error: 'Missing bvid or cid' },
            { status: 400 },
        )
    }
    const result = await getVideoSourceUrl(bvid, Number(cid))
    return NextResponse.json(result)
}
