/**
 * 通用API客户端
 */

/**
 * 通过服务端代理下载文件
 * 用于绕过CORS限制
 * @param url 需要下载的原始URL
 * @returns 代理URL
 */
function getProxyDownloadUrl(url: string): string {
    // 确保URL被正确编码
    const encodedUrl = encodeURIComponent(url)
    return `/api/download?url=${encodedUrl}`
}

/**
 * 通过服务端代理下载文件并保存
 * @param url 需要下载的原始URL
 * @param filename 保存的文件名
 */
export async function downloadViaProxy(
    url: string,
    filename: string,
): Promise<void> {
    // 获取代理URL
    const proxyUrl = getProxyDownloadUrl(url)

    try {
        // 创建一个a标签用于下载
        const link = document.createElement('a')
        link.href = proxyUrl
        link.download = filename

        // 添加到文档并触发点击
        document.body.appendChild(link)
        link.click()

        // 清理
        setTimeout(() => {
            document.body.removeChild(link)
        }, 100)
    } catch (error) {
        console.error('下载失败:', error)
        throw error
    }
}
