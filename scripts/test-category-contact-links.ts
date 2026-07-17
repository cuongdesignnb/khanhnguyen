import assert from 'node:assert/strict'
import { getProductCategoryHref } from '../lib/products/category-url'
import {
  isBrowserHandledHref,
  isValidConfiguredHref,
  normalizeConfiguredHref,
} from '../lib/urls/normalize-configured-href'

assert.equal(getProductCategoryHref('xe-nang-dien'), '/san-pham?category=xe-nang-dien')
assert.equal(getProductCategoryHref('  phụ kiện  '), '/san-pham?category=ph%E1%BB%A5%20ki%E1%BB%87n')
assert.equal(getProductCategoryHref(''), '/san-pham')

assert.equal(
  normalizeConfiguredHref('/https://www.facebook.com/?locale=vi_VN'),
  'https://www.facebook.com/?locale=vi_VN',
)
assert.equal(normalizeConfiguredHref('https://zalo.me/example'), 'https://zalo.me/example')
assert.equal(normalizeConfiguredHref('www.youtube.com/example'), 'https://www.youtube.com/example')
assert.equal(normalizeConfiguredHref('/lien-he'), '/lien-he')
assert.equal(normalizeConfiguredHref(' tel:0903000000 '), 'tel:0903000000')
assert.equal(isBrowserHandledHref('mailto:sales@example.com'), true)
assert.equal(isValidConfiguredHref('javascript:alert(1)'), false)

console.log('Category and contact link tests passed.')
