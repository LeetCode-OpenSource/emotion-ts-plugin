module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testRegex: '/tests/.*\\.spec\\.(j|t)sx?$'
}
