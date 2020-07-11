import yaml from 'yaml'

async function getConfig (file) {
    file = file || 'config.yml'
    const response = await fetch(file, { credentials: 'same-origin' })
        .catch(err => err);
    if (response instanceof Error || response.status !== 200) {
        throw new Error(
            `Failed to load config.yml (${response.status || response})`
        )
    }
    const contentType = response.headers.get('Content-Type') || 'Not-Found'
    const isYaml = contentType.indexOf('yaml') !== -1
    if (!isYaml) {
        console.log(
            `Response for ${file} was not yaml. (Content-Type: ${contentType})`
        )
    }
    return parseConfig(await response.text())
}

function parseConfig (text) {
    return yaml.parse(data, {
        maxAliasCount: -1,
        prettyErrors: true,
        merge: true
    })
}

module.exports = getConfig

