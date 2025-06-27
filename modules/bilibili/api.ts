import { Client } from '@renmu/bili-api'
import { VideoInfo, VideoSource } from './type'

const client = new Client()

export async function getVideoInfo(bvid: string): Promise<VideoInfo> {
    const info = await client.video.getInfo({
        bvid
    })
    return {
        title: info.title,
        bvid,
        pic: info.pic,
        desc: info.desc,
        owner: {
            name: info.owner.name,
            face: info.owner.face,
        },
        pages: info.pages.map((page: any) => ({
            cid: page.cid,
            name: page.part,
        }))
    }
}

export async function getVideoSourceUrl(bvid: string, cid: number): Promise<VideoSource> {
    const result = await client.video.playurl({
        bvid,
        cid,
        qn: 32,
        fnval: 1,
        platform: "html5"
    })
    return result.durl?.flatMap(item => [item.url, ...item.backup_url || []]) || []
}
