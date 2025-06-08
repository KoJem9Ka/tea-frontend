import boundaries from 'eslint-plugin-boundaries';

/**
 * @source https://ed.evocomm.space/guide/
 * @source https://github.com/clean-frontend/miro-code/blob/main/eslint.boundaries.js
 * @source https://www.youtube.com/watch?v=cRzcnKxmIZo
 */
export const eslintBoundariesConfig = {
  plugins: { boundaries },
  settings: {
    'import/resolver': { typescript: { alwaysTryTypes: true } },

    'boundaries/elements': [{
      type: 'app',
      pattern: './src/app',
    }, {
      type: 'features',
      pattern: './src/features/*',
    }, {
      type: 'shared',
      pattern: './src/shared',
    }],
  },
  rules: {
    'boundaries/element-types': [2, {
      default: 'allow',
      rules: [{
        from: 'shared',
        disallow: ['app', 'features'],
        message: 'Модуль нижележащего слоя (${file.type}) не может импортировать модуль вышележащего слоя (${dependency.type})',
      }, {
        from: 'features',
        disallow: ['app'],
        message: 'Модуль нижележащего слоя (${file.type}) не может импортировать модуль вышележащего слоя (${dependency.type})',
      }],
    }],
    'boundaries/entry-point': [2, {
      default: 'disallow',
      message: 'Модуль (${file.type}) должен импортироваться через public API. Прямой импорт из ${dependency.source} запрещен',
      rules: [{
        target: ['shared', 'app'],
        allow: '**',
      }, {
        target: ['features'],
        allow: ['index.(ts|tsx)', '*.page.tsx'],
      }],
    }],
  },
};
