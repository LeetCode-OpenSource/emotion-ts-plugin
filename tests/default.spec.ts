import * as ts from 'typescript'
import * as fs from 'fs'
import { join, basename } from 'path'

import { createEmotionPlugin } from '../src'

const printer = ts.createPrinter()
const baseDir = join(process.cwd(), 'tests', 'fixtures')
const fixtures = fs.readdirSync(baseDir)

describe('default options specs', () => {
  let emotion: ts.TransformerFactory<ts.SourceFile>
  
  fixtures.forEach((filename) => {
    const sourceCode = fs.readFileSync(join(baseDir, filename), 'utf-8')
    let sourceFile: ts.SourceFile
    let result: string
    beforeEach(() => {
      sourceFile = ts.createSourceFile(join(baseDir, filename), sourceCode, ts.ScriptTarget.ESNext, true)
      emotion = createEmotionPlugin()
      const [transformed] = ts.transform(sourceFile, [ emotion ], {
        target: ts.ScriptTarget.ES5,
        jsx: ts.JsxEmit.React,
      }).transformed
      result = printer.printFile(transformed)
    })

    it('should transform', () => {
      console.log(result)
    })
  })
})
