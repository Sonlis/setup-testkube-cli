import * as os from 'os'
import * as path from 'path'
import * as tar from 'tar'

export function getTestkubeArch(): string {
  const arch = os.arch()
  if (arch === 'x64') {
    return 'x86_64'
  }
  return arch
}

export async function extractBinary(tarFile: string) {
  await tar.x({
    file: tarFile,
    cwd: path.dirname(tarFile)
  })
}

export function getTestkubeDownloadURL(version: string, arch: string): string {
  const onlyNumericVersion = version.replace('v', '')
  switch (os.type()) {
    case 'Linux':
      return `https://github.com/kubeshop/testkube/releases/download/${version}/testkube_${onlyNumericVersion}_Linux_${arch}.tar.gz`

    case 'Darwin':
      return `https://github.com/kubeshop/testkube/releases/download/${version}/testkube_${onlyNumericVersion}_macOS_${arch}.tar.gz`

    case 'Windows_NT':
    default:
      return `https://github.com/kubeshop/testkube/releases/download/${version}/testkube_${onlyNumericVersion}_Windows_${arch}.tar.gz`
  }
}

export function getExecutableExtension(): string {
  if (os.type().match(/^Win/)) {
    return '.exe'
  }
  return ''
}
