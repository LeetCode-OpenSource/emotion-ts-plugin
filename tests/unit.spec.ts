import * as fs from 'fs'
import { join } from 'path'

import { addSerializer } from 'jest-specific-snapshot'
import * as ts from 'typescript'

import { createEmotionPlugin, Options } from '../src'

const printer = ts.createPrinter()
const baseDir = join(process.cwd(), 'tests', 'fixtures')
const fixtures = fs.readdirSync(baseDir)
const { config } = ts.parseConfigFileTextToJson(
  'tsconfig.json',
  fs.readFileSync(join(process.cwd(), 'tsconfig.json'), 'utf-8'),
)
const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(
  config.compilerOptions,
  process.cwd(),
  'tsconfig.json',
)

interface TransformBaseline {
  type: 'transform-baseline'
  filename: string
  content: string
  source: string
  transformed: string
}

addSerializer({
  test: (obj: any) => obj && obj.type === 'transform-baseline',
  print: (
    obj: TransformBaseline,
    _print: (object: any) => string,
    indent: (str: string) => string,
  ) =>
    `
File: ${obj.filename}
TypeScript before transform:
${indent(obj.content)}


      ↓ ↓ ↓ ↓ ↓ ↓

TypeScript after transform:
${indent(obj.transformed).replace(/ {4}/g, '  ')}
`,
})

const __ONLY_FILES__: string[] = []
const __SKIP_FILES__: string[] = []

fixtures
  .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
  .filter(
    (file) =>
      !__ONLY_FILES__.length ||
      __ONLY_FILES__.some((only) => file.startsWith(only)),
  )
  .filter(
    (file) =>
      !__ONLY_FILES__.length ||
      __SKIP_FILES__.every((skip) => !file.startsWith(skip)),
  )
  .forEach((filename) => {
    const sourceCode = fs.readFileSync(join(baseDir, filename), 'utf-8')
    const transform = transformFactory(filename, sourceCode)
    const pathToSnap = join(
      process.cwd(),
      'tests',
      '__snapshots__',
      `${filename}.shot`,
    )

    it(`should transform ${filename} with default configs`, () => {
      const result = transform()
      expect(result).toMatchSpecificSnapshot(pathToSnap)
    })

    it(`should transform ${filename} with sourcemap false`, () => {
      const result = transform({ sourcemap: false })
      expect(result).toMatchSpecificSnapshot(pathToSnap)
    })

    it(`should transform ${filename} with autoLabel false`, () => {
      const result = transform({ autoLabel: false })
      expect(result).toMatchSpecificSnapshot(pathToSnap)
    })

    it(`should not add sourcemap to ${filename} if NODE_ENV === 'production'`, () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      const result = transform()
      expect(result).toMatchSpecificSnapshot(pathToSnap)
      process.env.NODE_ENV = originalEnv
    })

    it(`should transform ${filename} with custom module`, () => {
      const result = transform({
        customModules: [
          {
            moduleName: 'my-emotion',
            exportedNames: ['myStyled', 'myCss'],
            styledName: 'myStyled',
          },
        ],
      })
      expect(result).toMatchSpecificSnapshot(pathToSnap)
    })
  })

it('auto insert jsx when css attribute used', () => {
  const sourceCode = `
export const Button = () => {
  return <div css={{ '.btn-text': { color: 'red' } }} />
}  
`
  const { outputText } = ts.transpileModule(sourceCode, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2018,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
    },
    transformers: {
      before: [
        createEmotionPlugin({
          autoInject: true,
          jsxImportSource: '@emotion/react',
        }),
      ],
    },
  })
  expect({
    transformed: outputText,
    source: sourceCode,
    filename: 'auto-import-test.tsx',
    type: 'transform-baseline',
    content: sourceCode,
  }).toMatchSpecificSnapshot(
    join(process.cwd(), 'tests', '__snapshots__', `auto-import-test.shot`),
  )
})

function transformFactory(
  filename: string,
  sourceCode: string,
  additionalCompilerOptions: ts.CompilerOptions = {},
): (options?: Options) => TransformBaseline {
  return (options?: Options) => {
    const emotion = createEmotionPlugin(options)
    const sourceFile = ts.createSourceFile(
      join(baseDir, filename),
      sourceCode,
      ts.ScriptTarget.ESNext,
      true,
    )
    const [transformed] = ts.transform(sourceFile, [emotion], {
      ...compilerOptions,
      ...{ jsx: ts.JsxEmit.React, jsxImportSource: undefined },
      ...additionalCompilerOptions,
    }).transformed
    return {
      transformed: printer.printFile(transformed),
      source: printer.printFile(sourceFile),
      filename,
      type: 'transform-baseline',
      content: sourceCode,
    }
  }
}
