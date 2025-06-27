import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

/**
 * 使用FFmpeg将视频倒放
 * @param ffmpeg FFmpeg实例
 * @param videoData 视频数据
 * @param mimeType 视频MIME类型
 * @returns 倒放后的视频数据
 */
export async function reverseVideo(
    ffmpeg: FFmpeg, 
    videoData: Uint8Array, 
    mimeType: string = 'video/mp4'
): Promise<Uint8Array> {
    // 生成唯一文件名
    const timestamp = Date.now().toString()
    const inputFileName = `input_${timestamp}.mp4`
    const outputFileName = `output_${timestamp}.mp4`
    
    try {
        // 写入输入文件
        await ffmpeg.writeFile(inputFileName, videoData)
        
        // 执行倒放命令
        await ffmpeg.exec([
            '-i', inputFileName,
            '-vf', 'reverse',  // 视频倒放
            '-af', 'areverse', // 音频倒放
            outputFileName
        ])
        
        // 读取输出文件
        const data = await ffmpeg.readFile(outputFileName)
        
        // 清理临时文件
        try {
            await ffmpeg.deleteFile(inputFileName)
            await ffmpeg.deleteFile(outputFileName)
        } catch (e) {
            console.warn('清理临时文件失败', e)
        }
        
        // 确保返回正确的Uint8Array类型
        if (data instanceof Uint8Array) {
            return data
        } else {
            throw new Error('FFmpeg返回的数据类型不正确')
        }
    } catch (error) {
        console.error('视频倒放处理失败:', error)
        throw error
    }
}
