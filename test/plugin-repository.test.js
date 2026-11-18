import assert from 'node:assert/strict'
import path from 'node:path'
import { test } from 'node:test'
import { parseFrontmatter, validatePluginRepository } from '../scripts/lib.js'

const fixtures = path.join(import.meta.dirname, 'fixtures')

test('parseFrontmatter reads plain, quoted and folded values', () => {
  const data = parseFrontmatter('---\r\nname: demo\r\ndescription: >-\r\n  one\r\n  two\r\ntitle: "a: b"\r\nnote: \'it\'\'s\'\r\nmetadata:\r\n  internal: true\r\n---\r\nbody')
  assert.deepEqual(data, { name: 'demo', description: 'one two', title: 'a: b', note: "it's", metadata: '' })
})

test('parseFrontmatter needs the --- lines', () => {
  assert.throws(() => parseFrontmatter('# no frontmatter'), /must start with a ---/)
  assert.throws(() => parseFrontmatter('---\nname: x\n'), /no closing ---/)
})

test('a plugin repository with plugin.json and skills passes', () => {
  assert.deepEqual(validatePluginRepository(path.join(fixtures, 'good'), 'demo-plugin'), [])
})

test('a plugin repository with wrong manifests and skills fails', () => {
  const errors = validatePluginRepository(path.join(fixtures, 'bad'), 'demo-plugin').join('\n')
  assert.match(errors, /plugin.json: "\$schema" must be/)
  assert.match(errors, /plugin.json: "name" must be "demo-plugin"/)
  assert.match(errors, /skills\/wrong-dir\/SKILL.md: "name" must be "wrong-dir"/)
  assert.match(errors, /skills\/wrong-dir\/SKILL.md: "description" must have/)
  assert.match(errors, /skills\/empty: SKILL.md is missing/)
})

test('a repository without plugin.json or skills fails', () => {
  const errors = validatePluginRepository(path.join(fixtures, 'good', 'skills'), 'demo-plugin').join('\n')
  assert.match(errors, /plugin.json is missing/)
  assert.match(errors, /skills\/ has no skill/)
})
