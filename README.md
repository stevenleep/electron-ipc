# Electron IPC

The electron-ipc system is a decorator-based IPC (Inter-Process Communication) management framework designed to simplify communication between Electron processes through the use of TypeScript decorators and dependency injection patterns. This framework abstracts complex IPC setup into declarative annotations while supporting multiple communication protocols including native Electron IPC, HTTP, and TCP.

## Decorator-Driven Design Pattern
The framework uses TypeScript decorators as the primary interface for defining IPC handlers. The `@IPCController` decorator marks classes as IPC controllers, while `@IPCCall` and `@IPCRequest` decorators define individual method endpoints. This approach eliminates boilerplate code and provides a clean, declarative API similar to modern web frameworks.

**Metadata Management System**

The framework employs `reflect-metadata` to store and retrieve decorator information at runtime. This metadata system tracks controller names, method signatures, and routing information, enabling automatic registration and proxy generation.

**Multi-Protocol Support**

The architecture abstracts IPC communication to support multiple protocols transparently. Applications can switch between Electron's native IPC, HTTP-based communication via Koa server, or custom TCP protocols without changing controller code.

## Key Benefits and Use Cases
The electron-ipc framework provides several advantages over manual IPC implementation:

- **Declarative API**: Controllers are defined using familiar decorator syntax
- **Type Safety**: Full TypeScript support with compile-time type checking
- **Protocol Flexibility**: Support for multiple communication protocols
- **Dependency Injection**: Integration with DI containers for service management
- **Security-First**: Leverages Electron's contextBridge for secure renderer communication
- **Development Efficiency**: Reduces boilerplate code and manual IPC setup
