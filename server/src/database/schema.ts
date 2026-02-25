import { varchar, uuid, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

export const registerRoleEnum = pgEnum('register_role',['user','admin']);

export const registerTable = pgTable('register_table', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name',{length:100}).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password:  text('password').notNull(),
    role: registerRoleEnum('role').default('user').notNull(),
    otp: varchar('otp',{length:6}),
    phoneNumber: varchar("phone_number", { length: 15 }).unique(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
});


export const profileGenderEnum = pgEnum('profile_gender', ['male','female','other']);

export const profileTable = pgTable('profile_table',{
    id: uuid('id').defaultRandom().primaryKey(),
    registerId: uuid('register_id')
    .references(() => registerTable.id, { onDelete: 'cascade' })
    .notNull(),
    name: varchar('name',{length:100}).notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    email: varchar('email', { length: 100 }).notNull().unique(),
    verified: boolean('verified').default(false),
    suspend: boolean('suspend').default(false),
    gender: profileGenderEnum('gender'),
    updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
});


