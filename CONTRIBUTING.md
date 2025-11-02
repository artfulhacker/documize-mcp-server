# Contributing to Documize MCP Server

Thanks for your interest in contributing! This is a personal project, but contributions are welcome.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/documize-mcp-server.git
   cd documize-mcp-server
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build**:
   ```bash
   npm run build
   ```

## Development Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code in `src/`
   - Update documentation if needed
   - Follow existing code style

3. **Test your changes**:
   ```bash
   npm run build
   npm run inspector
   ```

4. **Commit**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

## Code Style

- Use TypeScript
- Follow existing patterns
- Add JSDoc comments for public APIs
- Use async/await for async operations
- Handle errors appropriately

## Project Structure

```
documize-mcp-server/
├── src/
│   ├── index.ts              # Main server entry
│   ├── services/
│   │   ├── api-client.ts     # Base API client
│   │   ├── search-service.ts # Search operations
│   │   ├── document-service.ts
│   │   ├── space-service.ts
│   │   ├── attachment-service.ts
│   │   └── user-service.ts
├── build/                    # Compiled output
├── package.json
└── tsconfig.json
```

## Adding New Features

### Adding a New Tool

1. **Add method to appropriate service** (e.g., `document-service.ts`):
   ```typescript
   async newOperation(param: string): Promise<any> {
     return this.client.get(`/api/endpoint/${param}`);
   }
   ```

2. **Add tool definition** in `src/index.ts`:
   ```typescript
   {
     name: "documize_new_operation",
     description: "Description of what it does",
     inputSchema: {
       type: "object",
       properties: {
         param: { type: "string", description: "Parameter description" }
       },
       required: ["param"]
     }
   }
   ```

3. **Add handler** in the CallToolRequest handler:
   ```typescript
   case "documize_new_operation":
     result = await documentService.newOperation(args.param);
     break;
   ```

### Adding a New Service

1. Create `src/services/new-service.ts`:
   ```typescript
   import { ApiClient } from './api-client.js';

   export class NewService extends ApiClient {
     async operation(): Promise<any> {
       return this.client.get('/api/endpoint');
     }
   }
   ```

2. Import and initialize in `index.ts`
3. Add tools for the service

## Testing

```bash
# Build
npm run build

# Test with MCP Inspector
npm run inspector

# Test specific scenarios
npm run inspector -- --tool documize_search
```

## Documentation

Update these files when making changes:
- `README.md` - For user-facing features
- `QUICKSTART.md` - For usage examples
- `CHANGELOG.md` - For all changes
- This file - For development changes

## Pull Request Guidelines

- **Title**: Brief description of changes
- **Description**: 
  - What changed
  - Why it changed
  - How to test it
- **Link issues** if applicable
- **Keep PRs focused** - one feature/fix per PR

## Questions?

Open an issue on GitHub: https://github.com/artfulhacker/documize-mcp-server/issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
