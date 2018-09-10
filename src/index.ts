import * as ts from 'typescript'
import { SourceMapGenerator } from 'source-map'
import * as convert from 'convert-source-map'
import { basename, relative, dirname, join } from 'path'

export interface Options {
  sourcemap?: boolean
  autoLabel?: boolean
}

const libraries = ['react-emotion']

const defaultOptions: Options = {
  sourcemap: true,
  autoLabel: true,
}

export const createEmotionPlugin = (options: Options = defaultOptions) => {
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    const importCalls: string[] = []
    let sourcemapGenerator: SourceMapGenerator
    const visitor: ts.Visitor = (node) => {
      if (ts.isSourceFile(node)) {
        return ts.visitEachChild(node, visitor, context)
      }
      if (ts.isImportDeclaration(node)) {
        const moduleName = (<ts.StringLiteral>node.moduleSpecifier).text
        const { name, namedBindings } = node.importClause!
        if (libraries.includes(moduleName)) {
          if (name) {
            importCalls.push(name.text)
          } else if (namedBindings) {
            if (ts.isNamedImports(namedBindings)) {
              namedBindings.forEachChild((node) => {
                if ((node as ts.ImportSpecifier).propertyName!.text === 'default') {
                  importCalls.push((node as ts.ImportSpecifier).name!.text)
                }
              })
            } else {
              importCalls.push(namedBindings.name!.text)
            }
          }
        }
        return node
      }

      if (options.sourcemap) {
        if (ts.isCallExpression(node)) {
          const { expression } = node
          if (ts.isCallExpression(expression)) {
            const { expression: subExpression } = expression
            if (ts.isIdentifier(subExpression)) {
              if (importCalls.includes(subExpression.text)) {
                const lineAndCharacter = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.pos)
                sourcemapGenerator.addMapping({
                  generated: {
                    line: 1,
                    column: 0,
                  },
                  source: join(basename(node.getSourceFile().fileName)),
                  original: {
                    line: lineAndCharacter.line + 1,
                    column: lineAndCharacter.character,
                  }
                })
                const comment = convert.fromObject(sourcemapGenerator).toComment({ multiline: true })
                return ts.updateCall(node, node.expression, node.typeArguments, node.arguments.concat([
                  ts.createStringLiteral(comment),
                ]))
              }
            }
          }
        }
      } 
  
      return ts.visitEachChild(node, visitor, context)
    }
    return (node) => {
      sourcemapGenerator = new SourceMapGenerator({
        file: basename(node.fileName),
        sourceRoot: join('.', `${relative(process.cwd(), dirname(node.fileName))}`),
      })
      return ts.visitNode(node, visitor)
    }
  }
  return transformer
}
