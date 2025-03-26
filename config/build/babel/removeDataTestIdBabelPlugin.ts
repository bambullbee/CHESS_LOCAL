import { PluginItem } from "@babel/core";
import { node } from "webpack";

//code shift - изменение AST абстрактного синтаксического дерева. цель плагина - убирать из элементов атрибуты с имененем data-testid для prod сборки. babel работает с ast

export function removeDataTestIdBabelPlugin(): PluginItem {
  return {
    visitor: {
      Program(path, state) {
        const forbiddenProps = state.opts.props || [];
        path.traverse({
          JSXIdentifier(current) {
            const nodeName = current.node.name;
            if (forbiddenProps.includes(nodeName)) {
              current.parentPath.remove();
            }
          },
        });
      },
    },
  };
}
