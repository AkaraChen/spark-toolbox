/**
 * Types for the changelog module
 */

export interface PackageInfo {
    name: string
    homepage?: string
    repository?: string | {
        url: string
        type?: string
    }
}

export interface GitInfo {
    user: string
    project: string
    type: string
    browse: () => string
}

export interface RepositoryFile {
    name: string
    html_url: string
    type: string
}

export interface Release {
    html_url: string
    tag_name: string
    name: string
    published_at: string
}

export interface ChangelogResult {
    npmUrl: string
    homepage?: string
    repositoryUrl?: string
    changelogUrl?: string
    releasesUrl?: string
}
