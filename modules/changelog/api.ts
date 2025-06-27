import { Octokit } from 'octokit'
import { getPackageManifest } from 'query-registry'
import {
    ChangelogResult,
    GitInfo,
    PackageInfo,
    RepositoryFile,
    Release,
} from './types'

/**
 * Parse GitHub repository information from package info
 * @param packageInfo Package information
 * @returns GitHub repository information or null if not found
 */
export async function parseGitInfo(
    packageInfo: PackageInfo,
): Promise<GitInfo | null> {
    try {
        // Dynamic import for hosted-git-info which is a CommonJS module
        const hostedGitInfo = require('hosted-git-info')

        const repoUrl =
            typeof packageInfo.repository === 'string'
                ? packageInfo.repository
                : packageInfo.repository?.url

        if (!repoUrl) return null

        const gitInfo = hostedGitInfo.fromUrl(repoUrl)
        if (!gitInfo || gitInfo.type !== 'github') return null

        return gitInfo
    } catch (error) {
        console.error('Error parsing git info:', error)
        return null
    }
}

/**
 * Get changelog information for a package
 * @param packageName npm package name
 * @param githubToken Optional GitHub token for API access
 * @returns Changelog information
 */
export async function getChangelogInfo(
    packageName: string,
    githubToken?: string,
): Promise<ChangelogResult> {
    // Initialize result object
    const result: ChangelogResult = {
        npmUrl: new URL(packageName, 'https://www.npmjs.com/package/').href,
    }

    try {
        // Get package information from npm
        const packageInfo = await getPackageManifest(packageName)

        // Add homepage if available
        if (packageInfo.homepage) {
            result.homepage = packageInfo.homepage
        }

        // Get git repository information
        const gitInfo = await parseGitInfo(packageInfo)
        if (!gitInfo) {
            return result
        }

        // Add repository URL
        result.repositoryUrl = gitInfo.browse()

        // Initialize GitHub API client
        const octokit = new Octokit({
            auth: githubToken || undefined,
        })

        // Get repository contents
        const { data: files } = (await octokit.request(
            'GET /repos/{owner}/{repo}/contents/{path}',
            {
                owner: gitInfo.user,
                repo: gitInfo.project,
                path: '',
            },
        )) as { data: RepositoryFile[] }

        // Look for changelog files
        const changelogNames = [
            'CHANGELOG.md',
            'CHANGELOG',
            'CHANGELOG.txt',
            'CHANGELOG.rst',
            'CHANGES.md',
            'CHANGES',
            'CHANGES.txt',
        ]

        const changelog = files.find(file => changelogNames.includes(file.name))
        if (changelog) {
            result.changelogUrl = changelog.html_url
        }

        // Get releases information
        const { data: releases } = (await octokit.request(
            'GET /repos/{owner}/{repo}/releases',
            {
                owner: gitInfo.user,
                repo: gitInfo.project,
            },
        )) as { data: Release[] }

        if (releases.length > 0) {
            result.releasesUrl = `https://github.com/${gitInfo.user}/${gitInfo.project}/releases`
        }
    } catch (error) {
        console.error('Error getting changelog info:', error)
    }

    return result
}
