import * as path from 'path'
import * as util from 'util'
import * as fs from 'fs'

import axios from 'axios'
import * as toolCache from '@actions/tool-cache'
import * as core from '@actions/core'

import {
  getTestkubeDownloadURL,
  getExecutableExtension,
  extractBinary,
  getTestkubeArch
} from './helpers'

const testkubeToolName = 'kubectl-testkube'
const backupTestkubeVersion = 'v1.28.0'

export async function run() {
  let version = core.getInput('version', {required: true})
  if (version.toLocaleLowerCase() === 'latest') {
    version = await getStableKubectlVersion()
  }
  const cachedPath = await downloadTestkube(version)

  core.addPath(path.dirname(cachedPath))

  core.debug(
    `Testkube tool version: '${version}' has been cached at ${cachedPath}`
  )
  core.setOutput('testkube-path', cachedPath)
}

export async function getStableKubectlVersion(): Promise<string> {
  return await axios
    .get('https://api.github.com/repos/kubeshop/testkube/releases/latest')
    .then(
      response => {
        return response.data.tag_name
      },
      error => {
        core.debug(error)
        core.warning('GetLatestVersionFailed, defaulting to backup version')
        return backupTestkubeVersion
      }
    )
}

export async function downloadTestkube(version: string): Promise<string> {
  let cachedToolpath = toolCache.find(testkubeToolName, version)
  let testkubeDownloadPath = ''
  const arch = getTestkubeArch()
  if (!cachedToolpath) {
    try {
      testkubeDownloadPath = await toolCache.downloadTool(
        getTestkubeDownloadURL(version, arch)
      )
    } catch (exception) {
      if (
        exception instanceof toolCache.HTTPError &&
        exception.httpStatusCode === 404
      ) {
        throw new Error(
          util.format("Testkube '%s' for '%s' arch not found.", version, arch)
        )
      } else {
        throw new Error('DownloadTestkubeFailed')
      }
    }
    await extractBinary(testkubeDownloadPath)
    cachedToolpath = await toolCache.cacheFile(
      path.dirname(testkubeDownloadPath) +
        '/' +
        testkubeToolName +
        getExecutableExtension(),
      testkubeToolName + getExecutableExtension(),
      testkubeToolName,
      version
    )
  }

  const testkubePath = path.join(
    cachedToolpath,
    testkubeToolName + getExecutableExtension()
  )
  fs.chmodSync(testkubePath, '775')
  return testkubePath
}

run().catch(core.setFailed)
