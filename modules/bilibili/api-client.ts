import type { VideoInfo, VideoSource } from './type'
import { createClient } from '@/modules/universal/utils/fetch'

/**
 * 获取视频信息
 * @param bvid B站视频BV号
 * @returns 视频信息
 */
export const getVideoInfo = async (bvid: string): Promise<VideoInfo> => {
    const http = createClient(window.location.origin)
    const searchParams = new URLSearchParams()
    searchParams.set('bvid', bvid)
    return http.get(`/bilibili/info?${searchParams.toString()}`, {})
}

/**
 * 获取视频源URL
 * @param bvid B站视频BV号
 * @param cid 视频分P的cid
 * @returns 视频源URL列表
 */
export const getVideoSourceUrl = async (
    bvid: string,
    cid: number,
): Promise<VideoSource> => {
    const http = createClient(window.location.origin)
    const searchParams = new URLSearchParams()
    searchParams.set('bvid', bvid)
    searchParams.set('cid', cid.toString())
    return http.get(`/bilibili/video-url?${searchParams.toString()}`, {})
}
