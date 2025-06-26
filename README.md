# <p align='center'>MemoStack – Smart Notes API

<div align="center">

![example1](https://img.shields.io/badge/nodejs-v22.16.0-4DC71F?logo=nodedotjs&logoColor=4DC71F)
![example1](https://img.shields.io/badge/typescript-v5.8.3-3178C6?logo=TypeScript&logoColor=3178C6)
![example1](https://img.shields.io/badge/tsnode-v10.9.2-3178C6?logo=ts-node&logoColor=3178C6)
![example1](https://img.shields.io/badge/NPM-v11.4.2-CB3837?logo=npm&logoColor=CB3837)
![example1](https://img.shields.io/badge/Nodemon-v3.1.10-76D04B?logo=nodemon&logoColor=76D04B)
![example1](https://img.shields.io/badge/express-v5.1.0-000000?logo=express&logoColor=000000)
![example1](https://img.shields.io/badge/mongodb-v8.0.10-47A248?logo=mongodb&logoColor=47A248)
![example1](https://img.shields.io/badge/mongoose-v8.15.1-880000?logo=mongoose&logoColor=880000)
![example1](https://img.shields.io/badge/JWT-v8.15.1-FC015D?logo=jsonwebtokens&logoColor=FC015D)
![example1](https://img.shields.io/badge/redis-v5.5.6-FF4438?logo=redis&logoColor=FF4438)
![example1](https://img.shields.io/badge/cloudinary-v2.6.1-3448C5?logo=cloudinary&logoColor=3448C5)

</div>
</p>

<br/>

## Overview / Description

MemoStack is a modern, secure, and modular note-taking API inspired by tools like Google Keep Notes. It's designed to provide users with a structured way to create, organize, and manage personal notes, tasks, and labels — with advanced features like OTP-based authentication, data caching with Redis, and cloud file attachment.

Built with **Node.js**, **TypeScript**, and **MongoDB**, MemoStack is more than a CRUD app — it's a scalable system that balances performance with clean design and privacy-focused architecture.

## Features – What Makes MemoStack Smart?

### 1. User Authentication & OTP Verification

- Secure registration with email OTP confirmation.
- Password reset and account deletion also requires OTP to prevent malicious actions.
- Smart flow for account protection and real users only.

### 2. JWT Access Tokens with Password Change Validation

- Automatically invalidates old tokens if the user updates their password.

- Ensures no token remains valid after sensitive changes.

### 3. Full Notes System (CRUD)

- Create, update, read, and delete notes.

- Support for normal notes, or notes with structured task checklists.

- Edit tasks inline, toggle completion, or even delete them.

### 4. Smart Task Management Inside Notes

- Fine-grained control over each task.

- Handle multiple actions in one request: edit, add, delete, or toggle status.

- Enables batch updates and productivity-focused note editing.

### 5. Labeling System (CRUD)

- Create and manage custom labels to categorize notes.

- Label-based filtering/searching available.

### 6. File Attachments with Cloudinary

- Upload multiple attachments to any note.

- Files stored securely on Cloudinary and linked to notes.

- Automatically deleted from Cloudinary when a note is permanently deleted.

### 7. Pinning & Archiving

- Pin important notes.

- Archive notes without deleting them.

- Restorable anytime.

### 8. Soft Delete (Trash Mode)

- Move notes to trash before permanent deletion.

- Notes are kept temporarily (with TTL field) and can be restored or auto-deleted after a period.

### 9. Search Across Notes & Labels

- Full-text search on note titles, body, and tasks.

- Search labels by name too.

### 10. Redis Caching Layer

- Caches results of GET endpoints to boost performance.

- Smart cache invalidation when data is created, updated, or deleted.

- Reduces DB load while keeping UX fast and fresh.

### 11. Rate Limiting & Helmet Security

- Prevent brute force attacks using express-rate-limit on auth endpoints.

- Security headers applied using helmet, including noSniff protection.

### 12. Custom Error Handling & Logging

- Centralized error handler.

- Uses structured custom errors with flexible log levels.

- Logs meaningful request context for easier debugging.

### 13. Modular & Scalable Code Architecture

- Follows separation of concerns and SOLID principles.

- Easy to extend for future features like reminders, tags, or even collaboration.

## System Design Logic – Behind the Scenes of MemoStack

### 1. Modular Architecture

- The project follows a modular, scalable architecture, where each domain (Auth, Note, Label) is separated by layers:

- Controller: Handles the request and response cycle.

- Service: Contains business logic.

- Repository: Handles database interaction.

- Interfaces: For strong typing and input validation consistency.

### 2. Custom Error Handling System

- A structured throwError Function is used to throw a a human-readable instead of throwing plain strings.

- Maintained asyncHandler decorator handles all the catched errors.

- Centralized asyncHandler decorator handles all the catched errors.

<br/>

> [!NOTE]
> Know more about the **asyncHandler Decorator** [Here.](https://github.com/Eng-MohamedEldeeb/memo-stack/blob/main/src/common/decorators/async-handler.decorator.ts)

<br/>

- Errors are categorized by error cause, status, and a human-readable message.

### 3. Strong Routes Security Handling with Custom Guards

- A custom guard system that is inspired by NestJS's design pattern of using guards.

- Protecting routes and enforcing access rules.

- My Custom Guards are high flexible system using decorators and OOP principles.

### 4. Authentication & Credential Validation

- JWT access token is generated at login.

- Every protected request uses a custom guard middleware that:

- Verifies the token.

- Checks if the user exists.

- Compares the token.iat with user.credentialsChangedAt to invalidate old tokens if password was changed.

### 5. OTP-based Email Confirmation System

- A custom EventEmitter is used to trigger sending OTP codes via email for:

- Registering new users.

- Password resets.

- Account deletion confirmation.

- OTP codes are stored with expiration and validated against incoming requests securely.

### 6. Caching with Redis

- GET endpoints like get all notes and get all labels use Redis for performance.

- Smart caching flow:

- Data is cached on the first request.

- On data modification (create/edit/delete), the cache is updated manually.

- Prevents unnecessary DB reads and ensures user sees updated data seamlessly.

### 7. Soft Delete with Mongo TTL

- Notes can be moved to trash instead of deleted permanently.

- Trashed notes have a trashedAt field.

- MongoDB TTL automatically removes them after a predefined expiration time unless restored manually.

### 8. Advanced Notes Editing System

- PATCH /note/:noteId allows compound edits:

- Change title/body.

- Add new tasks.

- Edit task names or completion status.

- Delete tasks via \_id with an empty name field.

<br/>

> **This unified design improves UX and simplifies frontend integration.**

<br/>

### 9. File Uploads with Cloudinary Integration

- Notes can contain file attachments via multipart/form-data.

- Uploaded files are stored in Cloudinary, and each note keeps track of its public_id and url.

- When a note is permanently deleted, its files are deleted from Cloudinary using the public_id.

### 10. Security Middleware Layer

- Applied middlewares:

- helmet: to secure headers.

- express-rate-limit: to prevent brute force on sensitive routes.

- cors: with controlled configuration.

### 11. Input Validation

- All request bodies and query parameters are validated using custom interfaces and middleware.

- Prevents malformed data from reaching the business logic layer.

### 12. Logging System

- Every error or key process logs:

- HTTP method, endpoint path, error message, and user context (if available).

- Helps during debugging or tracking production issues.

## Custom Guards – Securing MemoStack with Intelligence & Foresight

- MemoStack uses a layered custom guards system to ensure that every access point is secure, smart, and contextual.

### 1. JWT Authentication Guard

- Before accessing any protected endpoint:

- The request must include a valid JWT access token in the Authorization header.

- The guard:

- Decodes and verifies the token.

- Fetches the user associated with the token.

- Validates the user still exists and is not soft-deleted.

### 2. Credentials Change Validation Guard

**This is where security meets elegance:**

- On each authenticated request, the guard compares:

token.iat (Issued At timestamp)

with user.credentialsChangedAt (last time the password was changed)

• **If credentialsChangedAt > token.iat, the token is considered stale and access is denied.**

- Purpose: Instantly revoke old tokens when the password changes.

This prevents session hijacking and ensures that even if someone has an old token, it becomes useless the moment the user secures their account.

### 3. Action Guards Based on Note & Label Ownership

Every note and label action is guarded by ownership:

The system fetches the entity (note/label).

Compares the createdBy field with the user.\_id from the token.

If mismatched, a 403 Forbidden is thrown.

## Why it’s Special

These guards are centralized, reusable, and context-aware.

They’re not just about protection—they express intention:

<br/>

> “You’re safe here, not because we trust everyone, but because we verify everything.”

<br>

### My Philosophy

MemoStack’s guards don’t just restrict access…
They understand context, respect user security, and evolve with the app’s needs.
It’s not about locking doors—it’s about knowing when to open them, for who, and why.

<br/>

## Implementation Details – Building Custom Guards

My custom guard system is inspired by NestJS's design pattern of using guards for protecting routes and enforcing access rules. But instead of using Nest’s built-in @UseGuards(), I designed my own flexible system using decorators and OOP principles.

### applyGuardsActivator – A Custom Decorator for Guard Activation

- This utility allows any route to apply a chain of guards in a clean, reusable way:

```TS
export const applyGuardsActivator = (...activators: GuardActivator[]) => {
  return asyncHandler(async (req, res, next) => {
    for (const activator of activators) {
      await activator.canActivate(req)
    }
    return next()
  })
}
```

- Accepts a list of guard instances.

- Executes each guard’s canActivate() method sequentially.

<br/>

> [!NOTE]
> If any guard throws an error, the request will stop and the error will be handled globally.

## GuardActivator – The Abstract Blueprint

All guards in the app extend this abstract class to ensure consistency and enforce a unified structure:

```TS

export abstract class GuardActivator {
  abstract canActivate(req: IRequest): Promise<Boolean> | Boolean
}

```

Every guard must implement the canActivate() method.

This ensures polymorphism and allows guards to be applied dynamically.

### Example – IsAuthenticatedGuard

- This is a core guard that checks for a valid access token and attaches the payload to the request object:

```TS

class IsAuthenticatedGuard implements GuardActivator {
  canActivate(req: IRequest) {
    const { authorization } = req.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing token', status: 400 })

    const tokenPayload = verifyToken(token)

    req.tokenPayload = tokenPayload

    return true
  }
}

```

- Ensures the presence of a valid JWT in the Authorization header.

- If valid, it attaches the token’s payload (userId, email, etc.) to req.tokenPayload.

- Used as the foundation for any protected route.

### Why This Matters

- Using this architecture:

- You can reuse and compose guards easily.

- Guards remain testable, modular, and extensible.

- You retain full control over error handling, response structure, and request enrichment.

<br/>

> It’s not just about security—it’s about writing code that respects intention.

## Real Use Case – Chaining Multiple Guards for Route Protection

- To illustrate how we use our applyGuardsActivator decorator in practice, here’s how we protect the `/note/:id editing route`:

```TS
router.patch(
  '/:id',
  validate(validators.editSchema),
  applyGuardsActivator(
    isAuthenticatedGuard, // checks if the user has a valid token
    isAuthorizedGuard,    // checks if the token payload matches required data
    noteGuard             // checks if the note exists and belongs to the user
  ),
  NoteController.edit,
)

```

## What's Happening Here?

```TS
validate(validators.editSchema)
```

> - Validates the request body to ensure it matches the expected edit structure.

<br/>

```TS
applyGuardsActivator(...)
```

> - Sequentially applies the following guards:

### 1. isAuthenticatedGuard

_-_ Ensures the user has a valid JWT token.

### 2. isAuthorizedGuard

_-_ Verifies that the user making the request is authorized (e.g., matches userId in token).

### 3. noteGuard

_-_ Confirms that the note exists, hasn’t been deleted, and is owned by the user.

### NoteController.edit

_-_ Gets executed only if all guards pass. Clean and safe.

## Benefit

- This model provides fine-grained control, clear separation of concerns, and easy reusability across multiple routes.

- No route is exposed unless it's passed through the proper layers of verification.

## Installation & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Eng-MohamedEldeeb/memo-stack.git
cd memo-stack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root and add the following:

```env
# App:
PORT= 3000
APP_NAME= "Memo_Stack"

# Origin:
ORIGIN= "Your Front-end link"

# DB:
DB_URI= mongodb://localhost:27017/memo_stack

# Hash:
SALT= number

# JWT:
JWT_SECRET= your_jwt_secret

# Cloudinary:
CLOUD_NAME= your_name
API_KEY= your_key
API_SECRET= your_secret

# E-mail Service:
USER=your_email
PASS= your_pass

```

### 4. Run the app

**Install project dependencies and start a local server with the following terminal commands:**

```bash
npm run dev
```

<br/>

# API Endpoints

> [!NOTE] > **[Postman Link.](https://documenter.getpostman.com/view/37407571/2sB2xBEAMV)**

## Auth Endpoints: `/auth`

### POST: `/confirm-email`

- Purpose: Receive OTP code for email confirmation.
- Body:

```json
{
  "email": "example@any.com"
}
```

<br/>

### POST: `/register`

- Purpose: Register a new user.
- Body:

```json
{
  "fullName": "Full Name",
  "email": "example@any.com",
  "password": "password",
  "confirmPassword": "password",
  "birthDate": "MM-DD-YYYY",
  "otpCode": "0000"
}
```

<br/>

### POST: `/login`

- Purpose: Authenticate and return an access token.
- Body:

```json
{
  "email": "example@any.com",
  "password": "password"
}
```

<br/>

### POST: `/forgot-password`

- Purpose: Receive OTP code to reset password.
- Body:

```json
{
  "email": "example@any.com"
}
```

<br/>

### PATCH: `/reset-password`

- Purpose: Reset the user password.
- Body:

```json
{
  "email": "example@any.com",
  "newPassword": "password123",
  "confirmPassword": "password123",
  "otpCode": "0000"
}
```

<br/>

### DELETE: `/delete-account`

- Purpose: Request account deletion.
- Body:

```json
{
  "email": "example@any.com",
  "password": "password123"
}
```

<br/>

### DELETE: `/confirm-deleting`

- Purpose: Confirm user account deletion.
- Body:

```json
{
  "email": "example@any.com",
  "password": "password123"
}
```

<br/>

## Note Endpoints: `/note`

- Required header: `Authorization: Bearer <accessToken>`

<br/>

### GET: `/`

- Purpose: Get user notes.
- Query Param: `search` ( `optional` )

<br/>

### Examples on Searching Notes by:

- title:

> /note?search=note title

<br/>

- body content:

> /note?search=note body

<br/>

- task's name:

> /note?search=note task name

<br/>

### GET: `/archived`

- Purpose: Get archived notes.

<br/>

### GET: `/trashed`

- Purpose: Get trashed notes.

<br/>

### GET: `/:noteId`

- Purpose: Get a specific note.
- Params: `noteId`

<br/>

### POST: `/`

- Purpose: Create a new note.

<br/>

### Examples:

- Creating a normal note:
- Body:

```json
{
  "title": "note's title",
  "body": "note's body" // optional
}
```

<br/>

- Body (with tasks):

```json
{
  "title": "note's title",
  "tasks": [
    {
      "name": "task's name",
      "completed": true // optional
    }
  ]
}
```

<br/>

### POST: `/pin/:noteId`

- Purpose: Pin or unpin a note depends on if it is already pinned or not.
- Param: `noteId`

<br/>

### POST: `/attachments/:noteId`

- Purpose: Upload attachments to a note with validating files formate.
- Param: `noteId`
- Body: `multipart/form-data`, field: `attachments`, file: `image-file`

<br/>

### PATCH: `/:noteId`

- Purpose: Edit a note with a smart way in managing and editing note's tasks.
- Param: `noteId`

<br/>

## Cases When Editing a notes:-

### **Editing a note title or body:**

- Body:

```json
{
  // one at least of these fields should exists
  "title": "new title",
  "body": "new body"
}
```

<br/>

### **Adding or replacing a note label:**

- Body:

```json
{
  "label": "labelId"
}
```

<br/>

### **Adding a new task::**

- Body:

```json
{
  "tasks": [
    {
      "name": "task's name"
    },
    {
      "name": "task's name",
      "completed": true // optional
    }
  ]
}
```

<br/>

### **Edit task's name or status::**

- Body:

```json
{
  "tasks": [
    {
      "_id": "noteId",
      "name": "new name",
      "completed": true // or false
    }
  ]
}
```

### **And in case you wanted to delete a task then the `taskId` is required:**

- And the name value must be an **empty string** to be treated as a deleted task:
- Body:

```json
{
  "tasks": [
    {
      "_id": "taskId",
      "name": ""
    }
  ]
}
```

<br/>

### **Or even a combination with them all in one note::**

- Body:

```json
{
  "title": "new title",
  "body": "new body",
  "tasks": [
    {
      "name": "task's name"
    },
    {
      "name": "task's name",
      "completed": true
    },
    {
      "_id": "taskId",
      "name": ""
    },
    {
      "_id": "taskId",
      "completed": true
    },
    {
      "_id": "taskId",
      "completed": false
    }
  ]
}
```

<br/>

### PATCH: `/label/noteId?action=add&labelId=id`

- Purpose: Adding and removing label from note.

<br/>

### > Examples

- Adding label to note:

> /label/`noteId`?**`action`**=**`add`**&`labelId`=`id`

<br/>

- Removing label to note:

> /label/`noteId`?**`action`**=**`remove`**&`labelId`=`id`

<br/>

- Query Params:

  - `action`: `add` or `remove`
  - `noteId`: `Note Id`
  - `id`: `label Id`

  <br/>

### PATCH: `/archive/:noteId`

- Purpose: Archive a note.

<br/>

> [!NOTE]
> If the note was **pinned**, it will be **_unpinned_** when archiving it.

<br/>

### PATCH: `/restore/:noteId`

- Purpose: Restore a note (from **archive** or **trash**).

<br/>

### DELETE: `/`

- Purpose: Delete a note permanently or move to trash.
- Query Params:

  - `action`: `permanent` or `trash`
  - `id`: `noteId`

<br/>

## Label Endpoints: `/label`

- Required header: `Authorization: Bearer <accessToken>`

<br/>

### GET: `/`

- Purpose: Get user labels.
- Query Param: `search` ( `optional` )

<br/>

### GET: `/:labelId`

- Purpose: Get a specific label.
- Param: `labelId`

<br/>

### POST: `/`

- Purpose: Create a label.
- Body:

```json
{
  "name": "label's name"
}
```

<br/>

### PATCH: `/:labelId`

- Purpose: Rename a label.
- Body:

```json
{
  "name": "renamed label"
}
```

<br/>

### DELETE: `/:labelId`

- Purpose: Delete a label.
- Param: `labelId`
