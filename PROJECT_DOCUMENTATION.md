# PROJECT_DOCUMENTATION.md

## Mapa de Arquitectura del Sistema — Opinionity

> Documento generado a partir del análisis exhaustivo (línea por línea) del código fuente real del repositorio, en su estado de *working tree* actual (rama `main`). No se ha modificado, creado ni borrado ningún archivo de código del proyecto.

---

## 1. Resumen Ejecutivo y Stack Tecnológico

**Opinionity** es una aplicación tipo red social (microblogging) formada por dos aplicaciones independientes dentro de un monorepo:

- **`backend/`** — API REST construida con **NestJS 11** + **TypeORM** + **PostgreSQL** (con Swagger habilitado).
- **`frontend/`** — SPA construida con **Angular 21** (Standalone Components, Signals, Reactive Forms) + **Tailwind CSS 4** + **Lucide Angular** (iconos).

### 1.1 Versiones exactas (declaradas en `package.json` vs. instaladas en `node_modules`)

| Dependencia | Declarada | Instalada |
|---|---|---|
| `@nestjs/common` | ^11.1.28 | 11.1.28 |
| `@nestjs/core` | ^11.0.1 | — |
| `@nestjs/jwt` | ^11.0.2 | 11.0.2 |
| `@nestjs/typeorm` | ^11.0.3 | — |
| `@nestjs/config` | ^4.0.4 | — |
| `@nestjs/swagger` | ^11.4.6 | — |
| `@nestjs/mapped-types` | ^2.1.1 | — |
| `@nestjs/platform-express` | ^11.0.1 | — |
| `typeorm` | ^1.1.0 | 1.1.0 |
| `pg` | ^8.22.0 | 8.22.0 |
| `bcrypt` | ^6.0.0 | 6.0.0 |
| `class-validator` | ^0.15.1 | 0.15.1 |
| `class-transformer` | ^0.5.1 | — |
| `rxjs` | ^7.8.1 | — |
| `reflect-metadata` | ^0.2.2 | — |
| `typescript` | ^5.7.3 | 5.9.3 |
| `@angular/core` | ^21.2.0 | 21.2.18 |
| `@angular/common` | ^21.2.0 | — |
| `@angular/forms` | ^21.2.0 | — |
| `@angular/router` | ^21.2.0 | — |
| `@angular/platform-browser` | ^21.2.0 | — |
| `lucide` | ^1.26.0 | 1.26.0 |
| `lucide-angular` | ^1.0.0 | 1.0.0 |
| `tailwindcss` | ^4.1.12 | 4.3.3 |
| `@tailwindcss/postcss` | ^4.1.12 | 4.3.3 |
| `postcss` | ^8.5.3 | — |
| `rxjs` (frontend) | ~7.8.0 | 7.8.2 |
| `typescript` (frontend) | ~5.9.2 | 5.9.3 |
| `vitest` | ^4.0.8 | — |
| `jsdom` | ^28.0.0 | — |

**Infraestructura de base de datos:** PostgreSQL 16+ (imagen `postgres:latest`) + pgAdmin 4 en Docker Compose. Puerto host `5440` para la BD y `5054` para pgAdmin.

### 1.2 Árbol de directorios del proyecto

```
opinionity-project/
├── .gitignore
├── .prettierrc
├── readme.md                              # vacío
├── PROJECT_DOCUMENTATION.md               # este documento
│
├── backend/
│   ├── docker-compose.yml                 # postgres + pgadmin
│   ├── nest-cli.json
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── tsconfig.json / tsconfig.build.json
│   ├── env/
│   │   └── .development.env               # DB_HOST / DB_NAME / DB_PORT (no consumidos)
│   ├── src/
│   │   ├── main.ts                        # bootstrap NestJS + CORS + Swagger
│   │   ├── app.module.ts                  # ConfigModule + TypeOrmModule + APP_GUARD
│   │   ├── app.controller.ts / app.service.ts
│   │   └── resources/
│   │       ├── auth/
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── auth.guard.ts          # AuthGuard global (JWT)
│   │       │   ├── auth.module.ts
│   │       │   ├── constants.ts           # secret JWT hardcodeado
│   │       │   ├── decorators/public.decorator.ts
│   │       │   └── interfaces/
│   │       │       ├── jwtPayload.ts
│   │       │       └── requestWithUser.ts
│   │       ├── users/
│   │       │   ├── users.controller.ts
│   │       │   ├── users.service.ts
│   │       │   ├── users.module.ts
│   │       │   ├── dto/create-user.dto.ts / update-user.dto.ts
│   │       │   └── entities/user.entity.ts
│   │       ├── profiles/
│   │       │   ├── profiles.controller.ts / .service.ts / .module.ts
│   │       │   ├── dto/create-profiles.dto.ts / update-profiles.dto.ts
│   │       │   └── entities/profile.entity.ts
│   │       ├── posts/
│   │       │   ├── posts.controller.ts / .service.ts / .module.ts
│   │       │   ├── dto/create-post.dto.ts / update-post.dto.ts
│   │       │   └── entities/post.entity.ts
│   │       └── posts-stats/
│   │           ├── posts-stats.controller.ts / .service.ts / .module.ts
│   │           ├── dto/create-post-stats.dto.ts / update-post-stats.dto.ts
│   │           └── entities/post-stats.entity.ts
│   └── test/
│       └── app.e2e-spec.ts
│
└── frontend/
    ├── angular.json
    ├── package.json
    ├── tsconfig.json / tsconfig.app.json / tsconfig.spec.json
    ├── .postcssrc.json                    # plugin @tailwindcss/postcss
    ├── public/
    │   └── favicon.ico
    └── src/
        ├── index.html
        ├── main.ts                        # bootstrapApplication(App, appConfig)
        ├── styles.css                     # @import 'tailwindcss'
        └── app/
            ├── app.ts / app.html / app.css
            ├── app.config.ts              # providers globales (router, http, lucide)
            ├── app.routes.ts
            ├── guards/auth-guard.ts
            ├── interceptor/
            │   ├── auth-interceptor.ts    # NO registrado
            │   └── logging-interceptor.ts # NO registrado
            ├── services/
            │   ├── auth.service.ts        # login/register/getProfile + signal currentUser
            │   ├── feed.service.ts        # vacío
            │   └── profile.service.ts     # vacío
            └── pages/
                ├── login/
                │   ├── login.ts / .html / .css
                │   └── components/login-component-form.ts / .html
                ├── register/
                │   ├── register.ts / .html / .css
                │   └── components/register-component-form.ts / .html
                ├── feed/
                │   ├── feed.ts / .html / .css
                │   └── components/
                │       ├── aside-left/aside-left-component.ts / .html / .css
                │       ├── aside-right/aside-right-component.ts / .html / .css
                │       └── section/section-component.ts / .html / .css
                └── profile/
                    ├── profile.ts / .html / .css
```

---

## 2. Backend (NestJS)

### 2.1 Configuración global

**`src/main.ts`**
- `NestFactory.create(AppModule)`.
- **CORS** habilitado con:
  - `origin: 'http://localhost:4200'`
  - `methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS`
  - `credentials: true`
  - `allowedHeaders: ['Content-Type', 'Authorization', 'x-authentication-token']`
- **Swagger** en `/api` (DocumentBuilder: *"Users API"* / *"User documentation"* / v1.0).
- Puerto: `process.env.PORT ?? 3000`.

**`src/app.module.ts`**
- `ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/.${process.env.NODE_ENV}.env' })`.
- `TypeOrmModule.forRootAsync` inyectando `ConfigService`, pero con valores **hardcodeados** (no usa el config service):
  - `type: 'postgres'`, `host: 'localhost'`, `port: 5440`, `username: 'postgres'`, `password: 'postgres'`, `database: 'opinionity-dev'`
  - `entities: [User, Profile, Post, PostsStats]`
  - `synchronize: true` (schema autogenerado en cada arranque)
  - `autoLoadEntities: true`
- Registro global del guard: `{ provide: APP_GUARD, useClass: AuthGuard }`.
- Módulos importados: `AuthModule, UsersModule, ProfilesModule, PostsModule, PostsStatsModule`.

> Nota: `env/.development.env` define `DB_HOST`, `DB_NAME`, `DB_PORT`, pero **no** se leen en la fábrica de TypeORM; la conexión es literal.

**`docker-compose.yml`**
- `opinionity-dev-db`: `postgres:latest`, credenciales `postgres/postgres`, BD `opinionity-dev`, puerto `5440:5432`, volumen `dev_db_data`.
- `opinionity-pgadmin`: `dpage/pgadmin4`, usuario `admin@admin.com` / `admin`, puerto `5054:80`.

### 2.2 Entidades y Base de Datos (esquema TypeORM real)

#### Entidad `User` — tabla `users` (`users/entities/user.entity.ts`)

| Propiedad | Columna | Tipo | Constraints |
|---|---|---|---|
| `id` | `id` | `uuid` | `@PrimaryGeneratedColumn('uuid')` — PK |
| `email` | `email` | `varchar` | `unique: true` |
| `password` | `password` | `varchar` | con `@Exclude()` de class-transformer (nunca se serializa *si* hubiera ClassSerializerInterceptor) |
| `birthDate` | `birthDate` | `date` | `nullable: true` |
| `createdAt` | `createdAt` | `timestamp` | `@CreateDateColumn()` |

- **Relación:** `@OneToOne(() => Profile, (profile) => profile.user, { cascade: true })` → propiedad `profile: Profile`. **Lado inverso.** El `cascade: true` permite persistir el `Profile` al guardar el `User`.
- **Hooks de ciclo de vida:**
  - `@BeforeInsert() @BeforeUpdate() async hashPassword()`: si hay `password` y **no** empieza por `$2b$`, la encripta con `bcrypt.hash(password, 10)` (10 salt rounds).

#### Entidad `Profile` — tabla `profiles` (`profiles/entities/profile.entity.ts`)

| Propiedad | Columna | Tipo | Constraints |
|---|---|---|---|
| `id` | `id` | `uuid` (declarado TS `number`, inconsistencia) | `@PrimaryGeneratedColumn('uuid')` — PK |
| `username` | `username` | `varchar` | `unique: true` |
| `displayName` | `displayName` | `varchar` | `unique: true`, `nullable: true` |
| `description` | `description` | `text` | `nullable: true` |
| `gender` | `gender` | `varchar` | `nullable: true` |
| `location` | `location` | `varchar` | `nullable: true` |
| `followers` | `followers` | `int` | `default: 0` |
| `following` | `following` | `int` | `default: 0` |
| `likes` | `likes` | `int` | `default: 0` |
| `visits` | `visits` | `int` | `default: 0` |
| `comments` | `comments` | `int` | `default: 0` |
| `posts_number` | `posts_number` | `int` | `default: 0` |

- **Relación:** `@OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })` + `@JoinColumn()` → **lado propietario**. Posee la FK `userId` (columna `user`). Si se borra el `User`, el `Profile` se borra en cascada.

#### Entidad `Post` — tabla `posts` (`posts/entities/post.entity.ts`)

| Propiedad | Columna | Tipo | Constraints |
|---|---|---|---|
| `id` | `id` | `uuid` | `@PrimaryGeneratedColumn('uuid')` — PK |
| `content` | `content` | `text` | — |
| `created_at` | `created_at` | `timestamp` | `@CreateDateColumn()` |
| `updated_at` | `updated_at` | `timestamp` | `@UpdateDateColumn()` |

- **Relaciones:**
  - `@ManyToOne(() => User, { onDelete: 'CASCADE' })` + `@JoinColumn()` → **lado propietario** de `User` (FK `userId`). N posts → 1 user.
  - `@OneToOne(() => PostsStats, (ps) => ps.post, { cascade: true, onDelete: 'CASCADE' })` → **lado inverso** de `PostsStats`. Al crear un `Post` se puede persistir su `PostsStats` en cascada.

#### Entidad `PostsStats` — tabla `posts_stats` (`posts-stats/entities/post-stats.entity.ts`)

| Propiedad | Columna | Tipo | Constraints |
|---|---|---|---|
| `id` | `id` | `uuid` | `@PrimaryColumn('uuid')` — PK **no autogenerada** |
| `likes` | `likes` | `int` | `default: 0` |
| `visits` | `visits` | `int` | `default: 0` |
| `comments` | `comments` | `int` | `default: 0` |
| `comments_restricted` | `comments_restricted` | `boolean` | `default: false` |

- **Relación:** `@OneToOne(() => Post, (post) => post.postsStats, { onDelete: 'CASCADE' })` + `@JoinColumn({ name: 'id' })` → **lado propietario**, pero la FK se mapea a la **misma columna `id`** (el `posts_stats.id` = `post.id`, relación 1:1 con PK compartida). Por eso `id` no es autogenerada: se espera que la asigne la cascada desde el `Post`.

#### Diagrama de relaciones

```
User 1 ──── 1 Profile        (User: inverso cascade; Profile: propietario JoinColumn, onDelete CASCADE)
User 1 ──── N Post           (Post: propietario ManyToOne JoinColumn, onDelete CASCADE)
Post 1 ──── 1 PostsStats     (Post: inverso cascade; PostsStats: propietario JoinColumn{name:'id'} PK compartida)
```

### 2.3 Controladores y Endpoints

Convenciones: todos los endpoints salvo los marcados `@Public()` pasan por el **`AuthGuard` global** (APP_GUARD). Se indica el orden de declaración cuando importa (los routers de Express/NestJS resuelven en orden).

#### `AppController` — raíz `''` (`GET /`)
| Método | Ruta | Guard | Parámetros | Respuesta |
|---|---|---|---|---|
| GET | `/` | AuthGuard global (no público → **401** si no hay token) | — | `'Hello World!'` (string) |

#### `AuthController` — prefijo `auth`
| Método | Ruta | Guard | Parámetros | Respuesta |
|---|---|---|---|---|
| POST | `/auth/login` | `@Public()` | Body `{ email, password }` (`Record<string, any>` tipado suelto) | `200` `{ access_token: string; userId: string }` |
| POST | `/auth/register` | `@Public()` | Body `CreateUserDto` | `201` `{ accessToken: string; user: { id; email; profile } }` |
| GET | `/auth/profile` | `@UseGuards(AuthGuard)` (local) | Header `Authorization: Bearer <token>` | `req.user` (el **payload JWT** tal cual: `{ sub, email }`) |

#### `UsersController` — prefijo `users` (orden de declaración relevante)
| Orden | Método | Ruta | Guard | Parámetros | Respuesta |
|---|---|---|---|---|---|
| 1 | POST | `/users` | `@Public()` | Body `CreateUserDto` | `201` `User` (con `profile`) |
| 2 | GET | `/users` | `@Public()` | — | `200` `User[]` |
| 3 | GET | `/users/me` | global (protegido) | Header `Authorization` | `200` `User` con `profile` (vía `findOne`) |
| 4 | GET | `/users/:id` | `@Public()` | `:id` con `ParseUUIDPipe` | `200` `User` con `profile` |
| 5 | PATCH | `/users/:id` | global (protegido) | `:id` UUID + `UpdateUserDto` | `200` `User` |
| 6 | DELETE | `/users/:id` | `@Public()` | `:id` UUID | `200` `User` (eliminado) |

> **Orden crítico:** `/users/me` está declarado **antes** de `/users/:id`, por lo que `GET /users/me` no es capturado por el patrón `:id`. El endpoint `me` lee el userId del token: `req.user.sub || req.user.id` (el guard setea `req.user` = payload JWT `{ sub, email }`). También hay un `console.log('Objeto req.user completo:', req.user)`.
>
> Nota: `UsersController` **redefine localmente** la interfaz `RequestWithUser extends ExpressRequest { user?: { sub?; id?; email? } }` en lugar de reutilizar la de `auth/interfaces`.

#### `ProfilesController` — prefijo `profiles`
| Método | Ruta | Guard | Parámetros | Respuesta |
|---|---|---|---|---|
| POST | `/profiles` | global | Body `CreateProfilesDto` | `201` `Profile` |
| GET | `/profiles` | global | — | `200` `Profile[]` |
| GET | `/profiles/:id` | global | `:id` → se convierte con `+id` (número) | `200` `Profile` |
| PATCH | `/profiles/:id` | global | `:id` → `+id`, Body `UpdateProfilesDto` | `200` `Profile` |
| DELETE | `/profiles/:id` | global | `:id` → `+id` | `200` `Profile` |

> ⚠️ Los IDs de `profiles` son UUIDs, pero el controlador hace `+id` (cast a número) → falla en runtime para UUIDs reales.

#### `PostsController` — prefijo `posts`
| Método | Ruta | Guard | Parámetros | Respuesta |
|---|---|---|---|---|
| POST | `/posts` | global | Body `CreatePostDto` + parámetro `userId: string` **sin decorador** | `201` `Post` |
| GET | `/posts` | global | — | `200` `Post[]` |
| GET | `/posts/:id` | global | `:id` (sin pipe) | `200` `Post` |
| PATCH | `/posts/:id` | global | `:id`, Body `UpdatePostDto` | `200` `Post` |
| DELETE | `/posts/:id` | global | `:id` | `200` `Post` |

> ⚠️ Bug detectado: `create(@Body() createPostDto, userId: string)` — el parámetro `userId` **no tiene decorador** (ni `@Body`, `@Param`, `@Headers`...), por lo que NestJS no lo inyecta y `userId` llega `undefined` al servicio.

#### `PostsStatsController` — prefijo `posts-stats`
| Método | Ruta | Guard | Parámetros | Respuesta |
|---|---|---|---|---|
| POST | `/posts-stats` | global | Body `CreatePostStatsDto` | `201` `PostsStats` |
| GET | `/posts-stats` | global | — | `200` `PostsStats[]` |
| GET | `/posts-stats/:id` | global | `:id` (string) | `200` `PostsStats` |
| PATCH | `/posts-stats/:id` | global | `:id`, Body `UpdatePostStatsDto` | `200` `PostsStats` |
| DELETE | `/posts-stats/:id` | global | `:id` | `200` `PostsStats` |

### 2.4 Servicios y Métodos

#### `UsersService` (`users/users.service.ts`)
Inyecta `Repository<User>` (`userRepository`) y `Repository<Profile>` (`profileRepository`).

- **`create(createUserDto): Promise<User>`**
  1. Desestructura `email, password, birthDate, username, displayName, gender, location`.
  2. Crea `Profile` con: `username`, `displayName: displayName || username`, `gender`, `location`, `description: 'New user profile'`.
  3. Crea `User` con `{ email, password, birthDate, profile }`.
  4. `userRepository.save(user)` → el `@BeforeInsert` hashea la password (10 rounds) y el `cascade: true` persiste el `Profile`.
- **`findAll(): Promise<User[]>`** → `userRepository.find()` (sin relaciones; incluiría el hash en la respuesta, ver 2.5).
- **`findOne(id): Promise<User>`** → `findOne({ where: { id }, relations: { profile: true } })`; si no existe lanza `NotFoundException('User with ID ... not found')`.
- **`findOneLoging(email): Promise<User>`** → `findOne({ where: { email } })` **sin relaciones**; si no existe lanza `NotFoundException` (usado por AuthService para login y poder leer `user.password`).
- **`update(id, updateUserDto)`** → `findOne(id)` + `merge` + `save` (un `@BeforeUpdate` vuelve a evaluar el hash; como ya empieza por `$2b$`, no re-hashea).
- **`remove(id)`** → `findOne({ where: { id }, relations: { profile: true } })` + `remove` (borra el user y, por `onDelete: CASCADE` en `Profile`, el perfil asociado).

#### `AuthService` (`auth/auth.service.ts`)
Inyecta `UsersService` y `JwtService`.

- **`signIn(email, pass): Promise<{ access_token; userId }>`**
  1. `usersService.findOneLoging(email)`.
  2. Si no existe usuario → `UnauthorizedException`.
  3. `bcrypt.compare(pass, user.password)`; si no coincide → `UnauthorizedException`.
  4. Construye payload `{ sub: user.id, email: user.email }` y firma con `jwtService.signAsync(payload)`.
  5. Devuelve `{ access_token, userId: user.id }`.
- **`signUp(createUserDto)`**
  1. `usersService.create(createUserDto)` (persiste User+Profile).
  2. Payload `{ sub: user.id, email: user.email }`, firma token.
  3. Devuelve `{ accessToken, user: { id, email, profile } }`.

> Nota de convención: `signIn` devuelve la propiedad **`access_token`** (snake_case) y `signUp` devuelve **`accessToken`** (camelCase).

#### `UsersDataService` (`profiles/profiles.service.ts`)
Inyecta `Repository<Profile>`. Clase nombrada `UsersDataService` aunque el archivo es `profiles.service.ts`.
- `create(dto)` → `repository.create` + `save`.
- `findAll()` → `find()`.
- `findOne(id: number)` → `findOne({ where: { id } })`, `NotFoundException` si no existe.
- `update(id, dto)` → `findOne` + `merge` + `save`.
- `remove(id)` → `findOne` + `remove`.

#### `PostsService` (`posts/posts.service.ts`)
Inyecta `Repository<Post>`.
- **`create(createPostDto, userId)`** → crea `Post` con `{ ...dto, user: { id: userId }, postsStats: { likes: 0, visits: 0, comments: 0 } }` y `save`. La cascada persiste el `PostsStats` con el mismo `id` que el post.
- `findAll()` → `find()`.
- `findOne(id)` → `findOne({ where: { id } })`.
- `update(id, dto)` → `findOne` + `merge` + `save`.
- `remove(id)` → `findOne` con `relations: { postsStats: true }` + `remove` (borra post y stats en cascada).

#### `PostsStatsService` (`posts-stats/posts-stats.service.ts`)
Inyecta `Repository<PostsStats>`. CRUD estándar: `create`/`findAll`/`findOne`/`update`/`remove`, con `NotFoundException` en lectura.

#### `AppService` (`app.service.ts`)
- `getHello(): string` → `'Hello World!'`.

### 2.5 Autenticación y Seguridad

#### Configuración JWT (`auth.module.ts`)
- `JwtModule.register({ global: true, secret: jwtConstants.secret, signOptions: { expiresIn: '60s' } })`.
- **Expiración muy corta: 60 segundos.** No hay mecanismo de *refresh token* ni re-emisión automática en el frontend → los tokens caducan rápido.
- `secret` hardcodeado en `constants.ts` con el valor por defecto de la guía de NestJS (*"DO NOT USE THIS VALUE..."*). ⚠️ **Inseguro para producción.**

#### Guard global `AuthGuard` (`auth.guard.ts`)
- Registrado globalmente vía `APP_GUARD` en `app.module.ts`.
- Implementa `CanActivate`; inyecta `JwtService` y `Reflector`.
- **`canActivate`**:
  1. Lee metadata `IS_PUBLIC_KEY` del handler y de la clase (`reflector.getAllAndOverride`). Si `isPublic` → `true` (acceso libre).
  2. Extrae token: `request.headers.authorization?.split(' ')` → solo acepta esquema **`Bearer <token>`**.
  3. Si no hay token → `UnauthorizedException`.
  4. `jwtService.verifyAsync<JwtPayload>(token)`; en éxito **setea `request.user = payload`**.
  5. Si verificación falla → `UnauthorizedException`.

#### Decorador `@Public()` (`decorators/public.decorator.ts`)
- `export const IS_PUBLIC_KEY = 'isPublic';`
- `export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);`
- Usado en: `POST /auth/login`, `POST /auth/register`, `POST /users`, `GET /users`, `GET /users/:id`, `DELETE /users/:id`.

#### Interfaces de autenticación
- `JwtPayload` (`interfaces/jwtPayload.ts`): `{ id: number; email: string }` — ⚠️ **no coincide con el payload real firmado** (`{ sub, email }`). El guard setea `req.user = payload` con `sub`/`email`.
- `RequestWithUser` (`interfaces/requestWithUser.ts`): `extends Request { user?: JwtPayload }`.

#### Encriptación de contraseñas
- `bcrypt` con **10 salt rounds** en `User.hashPassword()` (`@BeforeInsert`/`@BeforeUpdate`), con guarda de idempotencia (`!password.startsWith('$2b$')`).

#### ⚠️ Observaciones de seguridad importantes
1. **`@Exclude()` en `password` no surte efecto**: `class-transformer` solo excluye propiedades si se registra el `ClassSerializerInterceptor` (global o por controlador). En `main.ts` **no se registra**, por lo que `findAll()` (`GET /users`) devuelve el **hash de la contraseña** en el JSON.
2. **Secret JWT en código fuente** y con el valor de ejemplo.
3. **CORS** permitido solo a `http://localhost:4200`, pero `allowedHeaders` incluye `x-authentication-token` (cabecera que el interceptor frontend añade pero que **no está activo**; el frontend real usa `Authorization: Bearer`).
4. `synchronize: true` en producción destruiría/recrearía el esquema automáticamente.
5. El endpoint `GET /users` (público) expone email + hash + birthDate de todos los usuarios.

---

## 3. Frontend (Angular)

### 3.1 Bootstrap y configuración de aplicación

**`src/main.ts`** — `bootstrapApplication(App, appConfig)` con manejo de error en consola.

**`src/app/app.config.ts`** — `ApplicationConfig` con providers:
- `provideBrowserGlobalErrorListeners()`
- `provideRouter(routes)`
- `provideHttpClient()` — **sin interceptors** (`withInterceptors` está comentado; `authInterceptor` y `loggingInterceptor` existen pero no están registrados).
- `importProvidersFrom(LucideAngularModule.pick({...}))` con 16 iconos globales:
  `File, House, Menu, UserCheck, Eye, FileIcon, Lock, User, UserLock, Dumbbell, Bell, Plus, ListFilter, Trash2, Pen, Lightbulb`.

**`src/index.html`** — `<app-root></app-root>`, título "Frontend", favicon por defecto.

**`src/styles.css`** — único contenido: `@import 'tailwindcss';` (Tailwind v4 vía plugin PostCSS definido en `.postcssrc.json` → `@tailwindcss/postcss`).

### 3.2 Enrutamiento y Guards (`app.routes.ts`)

| Ruta | Componente | Guard |
|---|---|---|
| `''` | `Feed` | `canActivate: [authGuard]` |
| `profile` | `Profile` | `canActivate: [authGuard]` |
| `login` | `Login` | — |
| `register` | `Register` | — |

**`authGuard` (`guards/auth-guard.ts`)** — `CanActivateFn`:
1. `localStorage.getItem('access_token')`.
2. Si existe → `return true`.
3. Si no → `router.navigateByUrl('/login')` **y** `return true` (⚠️ el guard devuelve `true` incluso redirigiendo; la navegación original llega a activarse aunque el router agenda la redirección a `/login`).

### 3.3 Componentes

Todos son **Standalone Components** (`standalone: true`). Los CSS de todos los componentes/páginas (`app.css`, `login.css`, `register.css`, `feed.css`, `profile.css`, y los de los componentes de feed) están **vacíos**; todo el estilo es **Tailwind utility classes** en los templates.

#### `App` (`app.ts`)
- Selector `app-root`, imports `[RouterOutlet]`, template `app.html` = solo `<router-outlet></router-outlet>`.
- Tiene un `signal('frontend')` llamado `title` sin uso en el template.

#### `Login` (`pages/login/login.ts`)
- Selector `login`, standalone, imports `[LucideAngularModule, LoginComponentForm]`.
- Inyecta `HttpClient`, `Router`, `AuthService`.
- Re-declara la interfaz `LoginData { email; password }` (duplicada con `auth.service.ts`).
- **`onLogin(data)`**: llama `authService.login(data).subscribe(...)`; si `response.access_token` → `router.navigateByUrl('/')`; si `response.message` → `alert(...)`; en `error` → `alert(error.error?.message || error.statusText)`.
- Template (`login.html`): `<login-component-form (login)="onLogin($event)"></login-component-form>`.

#### `LoginComponentForm` (`pages/login/components/login-component-form.ts`)
- Selector `login-component-form`, imports `[LucideAngularModule, ReactiveFormsModule, RouterLink]`.
- **Providers propios de iconos:** `{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ LogIn, Eye, EyeOff }) }`.
- **@Output() `login`** = `EventEmitter<LoginData>` (comunicación hijo → padre).
- Formulario reactivo: `loginForm = new FormGroup({ email: new FormControl(''), password: new FormControl('') })`.
- Estado local `showPassword: boolean`.
- `onLogin()` → `this.login.emit(this.loginForm.value)`.
- `togglePasswordVisibility()` → alterna `showPassword`.
- Template (`login-component-form.html`): tarjeta centrada con `i-lucide name="LogIn" [size]="24"`, form `[formGroup]="loginForm"` `(ngSubmit)="onLogin()"`, inputs email/password con `formControlName`, botón de ojo que alterna `Eye`/`EyeOff`, enlace *"Forgot password?"* con `routerLink="/forgot-password"` (ruta **inexistente** en el router) y enlace a `/register` mediante `<a href>`.

#### `Register` (`pages/register/register.ts`)
- Selector `register`, standalone, imports `[LucideAngularModule, registerComponentForm]`.
- Interfaz **`RegisterData { email; password; gender; username; displayname; location }`** — ⚠️ usa `displayname` (minúscula) y **no incluye `birthDate`** aunque el formulario lo emite.
- **`onRegister(data: any)`**: `authService.register(data).subscribe`; en `next` → `navigateByUrl('/login')`; en `error` → alert con el mensaje.
- Template: `<register-component-form (register)="onRegister($event)"></register-component-form>`.

#### `registerComponentForm` (`pages/register/components/register-component-form.ts`)
- Selector `register-component-form`, imports `[LucideAngularModule, ReactiveFormsModule]` (sin `.pick()`).
- **Providers:** `LUCIDE_ICONS` multi con `new LucideIconProvider({ UserPlus, Eye, EyeOff, ChevronDown })`.
- **@Output() `register`** = `EventEmitter<RegisterData>`.
- Formulario: `registerForm` con controles `email, password, gender, username, displayName, location, birthDate`.
- `onregister()` → `console.log` del valor del formulario + `this.register.emit(this.registerForm.value)`.
- `togglePasswordVisibility()`.
- Template: campos email, password (con toggle ojo), username, displayName, gender (`<select>` con opciones `male/female/prefer_not_to_say/other` y `i-lucide name="ChevronDown"`), location, birthDate (`<input type="date">`), botón submit "Register", enlace a `/login`.

#### `Feed` (`pages/feed/feed.ts`)
- Selector `feed`, imports `[AsideLeft, Section, AsideRight]`.
- `toggleTheme() {}` vacío.
- Template (`feed.html`): ⚠️ es un **HTML completo** (`<!doctype html>`, `<head>`, `<body>`) con fuentes de Google (Inter + Material Symbols Outlined), header móvil, grid de 12 columnas (aside-left col-span-3, main col-span-6 con `<section-component>` + 5 `<article>` estáticos de ejemplo, aside-right col-span-3), y barra de navegación inferior móvil. Todo el contenido es **estático/hardcodeado** (posts de ejemplo "Alex Tech", "Elena Viajes"). No consume datos reales.

#### `AsideLeft` (`pages/feed/components/aside-left`)
- Selector `aside-left-component`, sin imports, clase vacía.
- Template: logo Opinionity + nav (Home/Explore/Notifications/Profile con `href="/profile"`) + bloque de usuario estático (avatar, "Marcos @marcosdev") + botón dark_mode (sin lógica).

#### `Section` (`pages/feed/components/section`)
- Selector `section-component`, sin imports, clase vacía.
- Template: composer de post (avatar + `<textarea>` "How is your day going?" + botones Photo/Video + botón "Publish"). Todo estático; no emite eventos ni guarda datos.

#### `AsideRight` (`pages/feed/components/aside-right`)
- Selector `aside-right-component`, sin imports, clase vacía.
- Template: buscador + tarjeta "What is happening" (tendencias estáticas #Angular2026, Tailwind CSS).

#### `Profile` (`pages/profile/profile.ts`)
- Selector `profile`, standalone, imports `[]`, implementa `OnInit`.
- `private AuthService = inject(AuthService)`.
- `user = this.AuthService.currentUser` → **referencia directa al Signal global**.
- **`ngOnInit()`**: si `!this.user()` → `this.AuthService.getProfile().subscribe()`.
- Template (`profile.html`): HTML completo con CDN de Tailwind (`<script src="https://cdn.tailwindcss.com">`) y `darkMode: 'class'` configurado inline. Bindings reactivos al Signal: `{{ user()?.profile?.username || 'Loading...' }}`, `displayName`, `description`, `location`, `posts_number`, `followers`, `following`. El resto (header, tarjetas, posts de ejemplo, "Who to follow") es estático.

### 3.4 Servicios y Estado Reactivo

#### `AuthService` (`services/auth.service.ts`) — `providedIn: 'root'`
Interfaces exportadas:
- **`LoginData`**: `{ email: string; password: string }`.
- **`ProfileData`**: `{ username; displayName; description?; gender?; location?; followers?; following?; likes?; visits?; comments?; posts_number? }` (todos `string` o `number` según campo).
- **`UserProfile`**: `{ id: string; email: string; profile?: ProfileData }`.

Estado y métodos:
- **`currentUser = signal<UserProfile | null>(null)`** — Signal global de sesión.
- **`login(item: LoginData)`** → `POST http://localhost:3000/auth/login` tipado como `{ access_token: string; userId: string; message?: string }`. Con `tap`: si `res.access_token`, guarda en `localStorage` las claves **`access_token`** y **`userId`**.
- **`register(item: RegisterData)`** → `POST http://localhost:3000/auth/register` (sin procesar respuesta; el `accessToken` devuelto **no se persiste**).
- **`getProfile()`** → lee `localStorage.access_token`, construye `HttpHeaders({ Authorization: 'Bearer ' + token })` y hace `GET http://localhost:3000/users/me`. Con `tap`: `this.currentUser.set(user)`.
- **`logout()`** → `localStorage.removeItem('access_token')`, `removeItem('userId')`, `currentUser.set(null)`, `router.navigateByUrl('/login')`.

#### `FeedService` (`services/feed.service.ts`) — `providedIn: 'root'`, **vacío**.
#### `ProfileService` (`services/profile.service.ts`) — archivo **vacío**.

### 3.5 Interceptors (definidos pero NO registrados)

- **`authInterceptor`**: clona la request y añade cabecera `X-Authentication-Token: <access_token>` (en minúsculas, coincide con `allowedHeaders` del CORS). ⚠️ No se usa: el `provideHttpClient()` de `app.config.ts` no lo incluye, y el flujo real de perfil usa la cabecera `Authorization: Bearer` a mano en `AuthService.getProfile()`.
- **`loggingInterceptor`**: hace `console.log(req.url, 'returned a response with status', event.status)` en cada respuesta.

### 3.6 Configuración de UI y Providers de terceros

- **Lucide Angular**: dos niveles de provisión de iconos:
  1. **Global** en `app.config.ts` con `LucideAngularModule.pick({...})` (16 iconos).
  2. **Local por formulario** mediante `LUCIDE_ICONS` multi con `LucideIconProvider` (`LoginComponentForm`: LogIn/Eye/EyeOff; `registerComponentForm`: UserPlus/Eye/EyeOff/ChevronDown).
  - Uso en templates: `<i-lucide name="LogIn" [size]="24">`.
  - ⚠️ Los iconos `Eye`/`EyeOff` necesarios en los formularios se proveen localmente (no están en el `.pick()` global); el resto de páginas (Feed/Profile) usan **Material Symbols** por CDN, no Lucide.
- **Formularios Reactivos**: `ReactiveFormsModule` en `LoginComponentForm` y `registerComponentForm` (los únicos componentes que usan formularios).
- **Enrutamiento**: `provideRouter(routes)` + `RouterOutlet` en `App`. `RouterLink` solo se importa en `LoginComponentForm` (el enlace a /forgot-password).
- **HTTP**: `provideHttpClient()` sin interceptors.
- **Tailwind v4**: vía `@import 'tailwindcss'` en `styles.css` y plugin `@tailwindcss/postcss` en `.postcssrc.json`. `profile.html` además carga Tailwind por CDN.
- **Testing**: builder `@angular/build:unit-test` con **Vitest 4** (`tsconfig.spec.json` usa `vitest/globals`).

---

## 4. Flujos de Datos E2E (End-to-End)

### 4.1 Flujo de Registro

```
1. Usuario rellena register-component-form
   └─ FormGroup { email, password, gender, username, displayName, location, birthDate }
2. (ngSubmit) → registerComponentForm.onregister()
   └─ console.log(valor) + register.emit(registerForm.value)      [EventEmitter -> Output]
3. Register.onRegister(data)          (pages/register/register.ts)
   └─ authService.register(data)
      └─ POST http://localhost:3000/auth/register      (AuthService.register)
4. Backend: AuthController.register (@Public)
   └─ AuthService.signUp(CreateUserDto)
      └─ UsersService.create(dto)
         ├─ profileRepository.create({ username, displayName||username, gender, location, description:'New user profile' })
         ├─ userRepository.create({ email, password, birthDate, profile })
         └─ userRepository.save(user)
            ├─ @BeforeInsert → bcrypt.hash(password, 10)
            └─ cascade:true → INSERT en profiles (FK userId)
      └─ jwtService.signAsync({ sub: user.id, email: user.email })   (expira en 60s)
      └─ → { accessToken, user: { id, email, profile } }
5. Frontend: subscribe.next() → router.navigateByUrl('/login')
   └─ (⚠️ el accessToken de la respuesta NO se guarda en localStorage)
```

### 4.2 Flujo de Inicio de Sesión

```
1. Usuario rellena login-component-form
   └─ FormGroup { email, password }
2. (ngSubmit) → LoginComponentForm.onLogin()
   └─ login.emit(loginForm.value)                         [EventEmitter -> Output]
3. Login.onLogin(data)                    (pages/login/login.ts)
   └─ authService.login(data)
      └─ POST http://localhost:3000/auth/login            (AuthService.login)
4. Backend: AuthController.signIn (@Public, HttpCode 200)
   └─ AuthService.signIn(email, password)
      ├─ UsersService.findOneLoging(email)   → SELECT * FROM users WHERE email=? (sin relations)
      │   └─ (nuevamente: AuthService lanza UnauthorizedException si no existe,
      │      pero findOneLoging lanza NotFoundException antes — el 404 llega al cliente)
      ├─ bcrypt.compare(password, user.password)
      └─ jwtService.signAsync({ sub: user.id, email: user.email })
      → { access_token, userId }
5. Frontend: tap() → localStorage.setItem('access_token', res.access_token)
                        localStorage.setItem('userId', res.userId)
6. subscribe.next() → if (response.access_token) router.navigateByUrl('/')
   └─ Guard authGuard al entrar en '/' lee localStorage.access_token → permite acceso
```

### 4.3 Flujo de Recuperación del Perfil (`/users/me`)

```
1. Profile.ngOnInit()          (pages/profile/profile.ts)
   └─ if (!user()) → AuthService.getProfile().subscribe()
      └─ token = localStorage.getItem('access_token')
      └─ headers = HttpHeaders({ Authorization: `Bearer ${token}` })
      └─ GET http://localhost:3000/users/me
2. Backend: llega la request → AuthGuard global (APP_GUARD)
   ├─ Reflector lee IS_PUBLIC_KEY (no hay @Public) → continúa
   ├─ extractTokenFromHeader: 'Bearer <token>' → token
   └─ jwtService.verifyAsync(token) → éxito → request.user = { sub, email }
3. UsersController.getProfile (GET /users/me, declarado antes que /:id)
   └─ userId = req.user.sub || req.user.id
   └─ UsersService.findOne(userId)
      └─ findOne({ where: { id }, relations: { profile: true } })
      → SELECT users JOIN profiles (incluye el hash de password en el JSON, ver nota)
4. Frontend: tap((user) => currentUser.set(user))
   └─ Signal `currentUser` actualizado
5. Template de Profile: {{ user()?.profile?.username || 'Loading...' }} se re-renderiza reactivamente
```

> Nota E2E sobre la sesión: tras un `login` el usuario solo navega a `/` y **no** se llama a `getProfile()`, así que `currentUser` permanece `null` hasta visitar `/profile`. Tras un `logout`, el guard redirige a `/login`.

---

## 5. Interfaces y DTOs — Mapeo exacto Frontend ↔ Backend

### 5.1 Frontend (TypeScript)

**`LoginData`** (definida dos veces: `auth.service.ts:7` y `login.ts:8`)
```ts
export interface LoginData { email: string; password: string; }
```

**`RegisterData`** (`register.ts:8`) — ⚠️ nombre de campo divergente
```ts
export interface RegisterData {
  email: string; password: string; gender: string; username: string;
  displayname: string;   // ← minúscula, NO coincide con el formulario ni el backend
  location: string;
} // no incluye birthDate aunque el formulario lo emite
```

**`ProfileData`** (`auth.service.ts:12`)
```ts
export interface ProfileData {
  username: string; displayName: string;
  description?: string; gender?: string; location?: string;
  followers?: number; following?: number; likes?: number;
  visits?: number; comments?: number; posts_number?: number;
}
```

**`UserProfile`** (`auth.service.ts:26`)
```ts
export interface UserProfile { id: string; email: string; profile?: ProfileData; }
```

**`LoginData` respuestas tipadas en AuthService:**
- `login` → `{ access_token: string; userId: string; message?: string }`
- `getProfile` → `UserProfile`

### 5.2 Backend (DTOs + Entidades)

**`CreateUserDto`** (`users/dto/create-user.dto.ts`) — validaciones `class-validator`:
| Campo | Validaciones |
|---|---|
| `email: string` | `@IsEmail` ("Email format is not valid"), `@IsNotEmpty` |
| `password: string` | `@IsString`, `@IsNotEmpty`, `@MinLength(8)` ("Password must be at least 8 characters long") |
| `birthDate: Date` | `@Type(() => Date)`, `@IsDate` ("Birth date should be valid"), `@IsNotEmpty` |
| `username: string` | `@IsString`, `@IsNotEmpty` |
| `gender: string` | `@IsString`, `@IsNotEmpty` |
| `displayName?: string` | `@IsString`, `@IsOptional` |
| `location?: string` | `@IsString`, `@IsOptional` |
| `description?: string` | `@IsString`, `@IsOptional` |

**`UpdateUserDto`** = `PartialType(CreateUserDto)` (todos opcionales).

**`CreateProfilesDto`** (`profiles/dto/create-profiles.dto.ts`): `description (IsString, IsNotEmpty)`, `followers/likes/visits/comments/posts_number` (`IsNumber`, `IsNotEmpty`) — ⚠️ no incluye `username` ni `displayName` aunque existen en la entidad.
**`UpdateProfilesDto`** = `PartialType(CreateProfilesDto)`.

**`CreatePostDto`** (`posts/dto/create-post.dto.ts`): `content (IsString, IsNotEmpty, MaxLength(280))`, `user_id (IsString, IsNotEmpty)` — ⚠️ `user_id` se valida pero el servicio ignora el campo y usa el parámetro `userId` del controlador.
**`UpdatePostDto`** = `PartialType(CreatePostDto)`.

**`CreatePostStatsDto`** (`posts-stats/dto/create-post-stats.dto.ts`): `likes/visits/comments (IsInt, IsNotEmpty)`, `comments_restricted (IsBoolean, IsNotEmpty)`.
**`UpdatePostStatsDto`** = `PartialType(CreatePostStatsDto)`.

### 5.3 Mapa de correspondencia

| Concepto | Frontend | Backend | ¿Coinciden? |
|---|---|---|---|
| Login body | `LoginData { email, password }` | `CreateUserDto` parcial / `signIn` | ✅ |
| Register body | `RegisterData` (con `displayname`) | `CreateUserDto` (con `displayName`) + campos de perfil | ❌ `displayname` vs `displayName`; falta `birthDate` en la interfaz |
| Perfil | `ProfileData` | entidad `Profile` | ✅ (excepto `displayName` null vs. requerido en UI) |
| Usuario sesión | `UserProfile { id, email, profile }` | entidad `User` (+`Profile`) | ✅ (el backend además envía `password` hasheada por falta de serialización) |
| Token login | `{ access_token, userId }` | `AuthService.signIn` → `{ access_token, userId }` | ✅ |
| Token registro | no consumido | `AuthService.signUp` → `{ accessToken, user }` | ⚠️ camelCase `accessToken` vs snake_case `access_token` |
| Payload JWT real | — (no lo inspecciona) | `{ sub, email }` (aunque `JwtPayload` diga `{ id, email }`) | ❌ interno |

---

## 6. Observaciones técnicas del arquitecto (inconsistencias y deuda)

1. **`/users/me` y `@Exclude`**: sin `ClassSerializerInterceptor`, `GET /users` y `GET /users/me` devuelven el hash bcrypt de `password`. Riesgo de seguridad.
2. **JWT**: expira en **60s** y el frontend no tiene refresh; las sesiones se caen casi de inmediato. Secret hardcodeado.
3. **`JwtPayload`** declara `{ id: number }` pero se firma `{ sub, email }`; `users.controller` compensa con `req.user.sub || req.user.id`.
4. **`PostsController.create`**: `userId` sin decorador → siempre `undefined`; el `CreatePostDto.user_id` se valida pero no se usa.
5. **`ProfilesController`**: convierte UUIDs con `+id` a número → no funciona.
6. **`Profile.id`**: declarado `number` en TS pero es `uuid`.
7. **Interfaces frontend**: `RegisterData.displayname` (minúscula) no coincide con el form control `displayName` ni con el backend; `birthDate` no tipado.
8. **Guard `authGuard`**: devuelve `true` también al redirigir a `/login` (semántica dudosa).
9. **Templates de `Feed`/`Profile`**: son documentos HTML completos con `<html>/<body>` dentro de componentes Angular y contenido 100% estático (posts, tendencias, usuarios hardcodeados). `FeedService` y `ProfileService` están vacíos; el feed no consume `/posts`.
10. **Endpoints CRUD de `posts`, `posts-stats`, `profiles`** están protegidos por el guard global, mientras que `users` es mayormente público. El frontend no usa `posts-stats` ni `profiles` todavía.
11. **CORS** permite `x-authentication-token`, pero el interceptor que la envía no está registrado; el flujo real usa `Authorization: Bearer`.
12. **Inconsistencia de naming**: clase `UsersDataService` en `profiles.service.ts`; `findOneLoging` (typo); propiedad `posts_number` vs `postsStats`.
13. **Variables de entorno**: `env/.development.env` (DB_HOST/DB_NAME/DB_PORT) no se consumen en la fábrica de TypeORM (valores hardcodeados).
14. **`/auth/profile`** devuelve el payload JWT, no el usuario de BD; no se usa desde el frontend.
15. **Registro no loguea automáticamente**: el `accessToken` de `signUp` se descarta; el usuario debe iniciar sesión después.
