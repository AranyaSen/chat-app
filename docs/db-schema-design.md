# Schema: chat-app

Database: pgsql
Tables: 7
Columns are NOT NULL unless marked nullable.

## users

id: uuid PK
username: varchar(50) unique
email: varchar(255) unique
password_hash: varchar(255)
role: enum default:USER
image: varchar(500) nullable
is_active: boolean default:true
created_at: timestamptz
updated_at: timestamptz

## conversations

id: uuid PK
type: enum default:DIRECT
created_at: timestamptz
last_message_id: uuid FK nullable unique

## groups

id: uuid PK
conversation_id: uuid FK unique
created_by: uuid FK
name: varchar(100)
description: varchar(500) nullable
avatar: varchar(500) nullable
max_members: int default:10

## conversation_members

id: uuid PK
conversation_id: uuid FK
user_id: uuid FK
role: enum default:MEMBER
joined_at: timestamptz
left_at: timestamptz nullable
last_message_read: uuid FK nullable
UNIQUE (conversation_id, user_id)

## messages

id: uuid PK
conversation_id: uuid FK
sender_id: uuid FK
content: text
sent_at: timestamptz
is_edited: boolean default:false
edited_at: timestamptz nullable
is_deleted: boolean default:false
deleted_at: timestamptz nullable
INDEX (conversation_id, sent_at)

## message_reactions

id: uuid PK
message_id: uuid FK
user_id: uuid FK
reaction: varchar(32)
created_at: timestamptz
UNIQUE (message_id, user_id, reaction)

## notifications

id: uuid PK
user_id: uuid FK
message_id: uuid FK
created_at: timestamptz
read_at: timestamptz nullable
UNIQUE (user_id, message_id)
INDEX (user_id, read_at)

## Relationships

users.id → conversation_members.user_id (one-to-many)
conversations.id → conversation_members.conversation_id (one-to-many)
conversations.id → messages.conversation_id (one-to-many)
users.id → messages.sender_id (one-to-many)
conversations.id → groups.conversation_id (one-to-one)
users.id → groups.created_by (one-to-many)
messages.id → message_reactions.message_id (one-to-many)
users.id → message_reactions.user_id (one-to-many)
users.id → notifications.user_id (one-to-many)
messages.id → notifications.message_id (one-to-many)
messages.id → conversation_members.last_message_read (one-to-many)
messages.id → conversations.last_message_id (one-to-one)

## Enums

conversations.type: DIRECT, GROUP
users.role: USER, ADMIN
conversation_members.role: OWNER, MEMBER

## Notes

"Chat Application Table design" (near: users)

---

If you suggest changes to this schema, ALSO return them as a DrawSQL patch: one fenced ```json code block, so I can apply them to my diagram. If you are only answering a question, skip the patch.

Patch rules:

- One JSON object with "strategy": "merge"; combine every change into that single patch.
- Reference tables and columns by name. Only include what changes — omit unchanged columns and unused optional fields.
- Column: {"name","type","length","is_primary_key","is_auto_increment","is_nullable","is_unique_key","is_index","is_unsigned","default","enum_values"} — use exact type names for pgsql as shown in the schema above.
- Relationship: {"type":"one-to-many","source_table":"users","source_column":"id","target_table":"posts","target_column":"user_id"} — for "one-to-many" the source is the "one" side; for "many-to-one" the source is the "many" (foreign-key) side. Prefer "one-to-many".
- Add "default_type" ("string" | "function" | "number" | "boolean") when a default could be misread — a literal string "CURRENT_TIMESTAMP" or "0" needs "default_type":"string".
- SET columns (MySQL) list their members in "set_values", not "enum_values".
- Index: {"indexes":[{"name":"idx_posts_user_created","type":"index","columns":["user_id","created_at"]}]} on its table — "type" is "index" or "unique"; delete via "deletions".
- Group: {"name":"Billing"}. A group never lists its members — put "parent_name":"Billing" on each table that belongs to it.
- Sticky note: {"sticky_notes":[{"content":"..."}]}.
- Delete via "deletions"; rename via "old_name". Do not include left/top coordinates.

Examples:
Add table: `{"strategy":"merge","tables":[{"name":"posts","comment":"Blog posts","columns":[{"name":"id","type":"bigint","is_primary_key":true,"is_auto_increment":true},{"name":"user_id","type":"bigint","is_index":true},{"name":"title","type":"varchar","length":255},{"name":"body","type":"text","is_nullable":true},{"name":"created_at","type":"timestamp","is_nullable":true},{"name":"updated_at","type":"timestamp","is_nullable":true}]}]}`
Rename table and column (use old_name only when renaming): `{"strategy":"merge","tables":[{"name":"articles","old_name":"posts","columns":[{"name":"content","old_name":"body"}]}]}`
Delete: `{"strategy":"merge","deletions":{"tables":["tmp"],"columns":[{"table":"users","columns":["legacy"]}],"relationships":[{"source_table":"users","source_column":"id","target_table":"posts","target_column":"user_id"}]}}`
Multiple groups with nested tables (every table sets parent_name): `{"strategy":"merge","groups":[{"name":"Auth"},{"name":"Content"}],"tables":[{"name":"users","parent_name":"Auth","columns":[{"name":"id","type":"bigint","is_primary_key":true,"is_auto_increment":true}]},{"name":"roles","parent_name":"Auth","columns":[{"name":"id","type":"bigint","is_primary_key":true,"is_auto_increment":true}]},{"name":"posts","parent_name":"Content","columns":[{"name":"id","type":"bigint","is_primary_key":true,"is_auto_increment":true}]}]}`
