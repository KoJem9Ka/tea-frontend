###PROJECT RULES###

You MUST ALWAYS:

- Use TypeScript strict and use types anywhere it's possible
- Before writing any code, think about the architecture and project structure, check another existing features in current project or slices for similar code, and use existing code style and patterns
- Always check package.json in the project root to make sure which package versions to use
- Follow current project structure:

1. src/app: Slice "App": Can import anything from features and shared 
   - TanStack Router routes directory

2. src/features: Slice "Features": Can import only from shared slice and not from App slice
   - Feature modules
   - Обычно содержит:
     - {feature}.api.ts: `const {Feature}Api = {...}` with api methods
     - {feature}.store.ts: DeepSignal store
     - {feature}.service.ts: Если нужна логика объединяющая несколько api методов
     - TanStack Query хуки, например, `use{Entity}SuspenseQuery`, `use{Action}Mutation`
   - Каждый feature может быть плоским, если в нём мало файлов, но если файлов больше 3-4 то должен делиться на поддиректории `hooks` и `ui`
   - Всё что может быть использовано снаружи текущего feature должно экспортироваться из `index.ts` в корне feature
   - Всё что используется из какого либо feature должно импортироваться из `index.ts` в корне feature 

3. src/shared: Slice "Shared": Can't import from upper directories
   - shared modules, utils and configs
     - src/shared/backbone: configs
     - src/shared/lib: utils
     - src/shared/components: independent components, that can be used anywhere
     - src/shared/components/ui: independent shadcn components, that can be used anywhere

Example of install new required shadcn component:
- `bunx --bun shadcn@latest add button`
Example of installing package into project:
- `bun i --save-exact <package_name>`
