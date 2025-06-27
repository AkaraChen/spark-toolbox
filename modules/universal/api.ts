import { NextRequest, NextResponse } from 'next/server'

/**
 * 通用下载代理端点
 * 用于绕过CORS限制，透传请求到目标URL
 */
export async function GET(request: NextRequest) {
    try {
        // 从URL参数中获取目标URL
        const url = request.nextUrl.searchParams.get('url')

        if (!url) {
            return NextResponse.json(
                { error: 'URL parameter is required' },
                { status: 400 },
            )
        }

        // 解码URL（如果已编码）
        const decodedUrl = decodeURIComponent(url)

        // 发起请求到目标URL
        const response = await fetch(decodedUrl, {
            headers: {
                // 添加常用的请求头
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        })

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: `Failed to fetch from target URL: ${response.statusText}`,
                },
                { status: response.status },
            )
        }

        // 获取原始响应数据
        const data = await response.arrayBuffer()

        // 获取原始响应的Content-Type
        const contentType =
            response.headers.get('content-type') || 'application/octet-stream'

        // 创建新的响应，透传原始响应的内容和Content-Type
        return new NextResponse(data, {
            headers: {
                'Content-Type': contentType,
                // 添加下载相关的响应头
                'Content-Disposition': 'attachment',
                // 允许跨域访问
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        console.error('Proxy download error:', error)
        return NextResponse.json(
            { error: 'Failed to proxy download request' },
            { status: 500 },
        )
    }
}
