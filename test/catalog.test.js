import assert from 'node:assert/strict'
import fs from 'node:fs'
import { test } from 'node:test'
import { CATALOG, CLAUDE_MARKETPLACE, readJson, stringify, toClaudeMarketplace, validateCatalog } from '../scripts/lib.js'

const catalog = readJson(CATALOG)

test('the catalog is valid', () => {
  assert.deepEqual(validateCatalog(catalog), [])
})

test('.claude-plugin/marketplace.json matches the catalog (run npm run sync)', () => {
  assert.equal(fs.readFileSync(CLAUDE_MARKETPLACE, 'utf8').replace(/\r\n/g, '\n'), stringify(toClaudeMarketplace(catalog)))
})

test('every plugin has a row in the README', () => {
  const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8')
  for (const plugin of catalog.plugins) {
    assert.match(readme, new RegExp(`^\\| \\[${plugin.name}\\]`, 'm'), `README.md has no row for ${plugin.name}`)
  }
})

test('validateCatalog reports wrong entries', () => {
  const broken = {
    name: 'cbs',
    interface: { displayName: 'x' },
    plugins: [
      { name: 'b-plugin', description: 'B', source: { source: 'url', url: 'https://github.com/o/b.git' }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Development' },
      { name: 'A_plugin', description: '', source: './a', policy: {}, category: 'Other' }
    ]
  }
  const errors = validateCatalog(broken).join('\n')
  assert.match(errors, /"name" must be "cbs-consulting"/)
  assert.match(errors, /sorted by name/)
  assert.match(errors, /A_plugin": the name must be kebab-case/)
  assert.match(errors, /A_plugin": the description/)
  assert.match(errors, /A_plugin": "source" must be/)
  assert.match(errors, /A_plugin": "policy.installation"/)
  assert.match(errors, /A_plugin": "category"/)
  assert.doesNotMatch(errors, /Plugin "b-plugin"/)
})
