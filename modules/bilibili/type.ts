export interface VideoInfo {
    title: string
    bvid: string
    pic: string
    desc: string
    owner: {
        name: string
        face: string
    },
    pages: Array<{
        cid: number
        name: string
    }>
}

export type VideoSource = string[]
