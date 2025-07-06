# API Directory Structure (v2.0)

Clean, organized, and portable API library structure:

```
src/lib/api/
├── 📁 core/                    # 🔧 Generic, reusable functionality
│   ├── types.ts               # Generic interfaces and types
│   ├── dataManager.ts         # Generic data management class
│   ├── serverUtils.ts         # Generic SvelteKit utilities
│   ├── config.ts              # Configuration management
│   ├── client.ts              # HTTP client
│   ├── cache.ts               # Caching system
│   ├── errors.ts              # Error handling
│   ├── imageCache.ts          # Image optimization
│   ├── utils.ts               # Utility functions
│   └── index.ts               # Core exports
├── 📁 schemas/                # 📋 Project-specific type definitions
│   └── gicaSchema.ts          # GICA project schema
├── 📁 adapters/               # 🔌 Project-specific implementations
│   └── gicaAdapter.ts         # GICA project adapter
├── 📁 templates/              # 📝 Example templates for new projects
│   └── exampleProject.ts      # Copy this for new projects
├── 📁 legacy/                 # 🗂️ Backward compatibility
│   ├── staticApi.ts           # Legacy static API manager
│   ├── serverUtils.ts         # Legacy server utilities
│   └── types.ts               # Legacy type definitions
├── 📄 index.ts                # Main entry point (backward compatible)
├── 📄 README.md               # Documentation
└── 📄 MIGRATION_GUIDE.md      # Migration instructions
```

## Usage Patterns

### Modern Approach (Recommended)

```typescript
// GICA Project
import { getHome, getContributors } from '$lib/api/adapters/gicaAdapter';

// Generic Core (for new projects)
import { createDataManager } from '$lib/api/core';
```

### Legacy Approach (Still Works)

```typescript
// Existing GICA code continues to work
import { preloadAllData, getStaticData } from '$lib/api';
```

### New Project Setup

```typescript
// 1. Copy core/ folder to new project
// 2. Create your schema in schemas/yourSchema.ts
// 3. Create your adapter in adapters/yourAdapter.ts
// 4. Import and use your adapter functions
```

## Benefits of Clean Structure

✅ **Organized**: Clear separation of concerns  
✅ **Portable**: Easy to copy core/ to new projects  
✅ **Maintainable**: Each module has a specific purpose  
✅ **Backward Compatible**: Legacy code still works  
✅ **Extensible**: Easy to add new features  
✅ **Type Safe**: Full TypeScript support throughout

## Migration Status

- ✅ **Core functionality**: Moved to `core/` directory
- ✅ **GICA schema**: Defined in `schemas/gicaSchema.ts`
- ✅ **GICA adapter**: Available in `adapters/gicaAdapter.ts`
- ✅ **Legacy support**: Maintained in `legacy/` directory
- ✅ **Templates**: Available for new project setup
- ✅ **Documentation**: Updated with new structure
