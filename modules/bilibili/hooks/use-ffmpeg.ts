import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

/**
 * FFmpeg 加载和初始化的 Hook
 * @returns FFmpeg 实例和加载状态
 */
export function useFFmpeg() {
    const ffmpegRef = useRef<FFmpeg>(new FFmpeg())
    const messageRef = useRef<string>('')

    // 使用 useQuery 处理 FFmpeg 的加载
    const { 
        data: ffmpeg,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['ffmpeg-load'],
        queryFn: async () => {
            try {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
                const ffmpeg = ffmpegRef.current
                
                // 设置日志监听
                ffmpeg.on('log', ({ message }) => {
                    messageRef.current = message
                    console.log(message)
                })
                
                // 加载 FFmpeg 核心文件
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                })
                
                return ffmpeg
            } catch (err) {
                console.error('Failed to load FFmpeg:', err)
                throw err
            }
        },
        staleTime: Infinity,
        retry: 1,
    })

    return {
        ffmpeg,
        isLoading,
        isError,
        error,
        message: messageRef.current
    }
}
