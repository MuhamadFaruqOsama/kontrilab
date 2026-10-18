import { pgTable, text, timestamp, boolean, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['STUDENT', 'TEACHER', 'ADMIN']);
export const projectStatusEnum = pgEnum('project_status', ['NOT_STARTED', 'IN_PROGRESS', 'REVISION', 'FINISHED']);
export const groupRoleEnum = pgEnum('group_role', ['LEADER', 'MEMBER']);
export const discussionTopicEnum = pgEnum('discussion_topic', ['PROJECT_IDEA', 'PROGRESS', 'BLOCKER', 'REVISION', 'OTHER']);
export const discussionStatusEnum = pgEnum('discussion_status', ['DRAFT', 'RUNNING', 'FINISHED']);
export const progressStatusEnum = pgEnum('progress_status', ['IN_PROGRESS', 'FINISHED', 'BLOCKED']);
export const visibilityLevelEnum = pgEnum('visibility_level', ['LESS_VISIBLE', 'VISIBLE_ENOUGH', 'VERY_VISIBLE']);

// Better Auth Tables
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
    role: userRoleEnum('role').default('STUDENT').notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

// Kontrilab Custom Tables
export const userProfile = pgTable("user_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  className: text("class_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  className: text("class_name").notNull(),
  description: text("description").notNull(),
  joinCode: text("join_code").notNull().unique(),
  deadline: timestamp("deadline"),
  status: projectStatusEnum("status").default('NOT_STARTED').notNull(),
  ownerId: text("owner_id").references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const merge = pgTable("merge", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mergedProject = pgTable("merged_project", {
  id: text("id").primaryKey(),
  mergeId: text("merge_id").notNull().references(() => merge.id, { onDelete: 'cascade' }),
  sourceProjectId: text("source_project_id").notNull().references(() => project.id, { onDelete: 'cascade' }),
  targetProjectId: text("target_project_id").notNull().references(() => project.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectGroup = pgTable("project_group", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => project.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const groupMember = pgTable("group_member", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => projectGroup.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: groupRoleEnum("role").default('MEMBER').notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const discussionSession = pgTable("discussion_session", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => projectGroup.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  topic: discussionTopicEnum("topic").default('PROJECT_IDEA').notNull(),
  initialNote: text("initial_note"),
  status: discussionStatusEnum("status").default('RUNNING').notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const participant = pgTable("participant", {
  id: text("id").primaryKey(),
  discussionId: text("discussion_id").notNull().references(() => discussionSession.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const discussionChat = pgTable("discussion_chat", {
  id: text("id").primaryKey(),
  discussionId: text("discussion_id").notNull().references(() => discussionSession.id, { onDelete: 'cascade' }),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progressUpload = pgTable("progress_upload", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => projectGroup.id, { onDelete: 'cascade' }),
  discussionId: text("discussion_id").references(() => discussionSession.id, { onDelete: 'set null' }),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  description: text("description").notNull(),
  evidenceUrl: text("evidence_url"),
  status: progressStatusEnum("status").default('IN_PROGRESS').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const peerAssessment = pgTable("peer_assessment", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => projectGroup.id, { onDelete: 'cascade' }),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  discussionActivity: visibilityLevelEnum("discussion_activity").notNull(),
  teamwork: visibilityLevelEnum("teamwork").notNull(),
  sharedProgress: visibilityLevelEnum("shared_progress").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const participantScore = pgTable("participant_score", {
  id: text("id").primaryKey(),
  participantId: text("participant_id").notNull().references(() => participant.id, { onDelete: 'cascade' }),
  peerAssessmentId: text("peer_assessment_id").notNull().references(() => peerAssessment.id, { onDelete: 'cascade' }),
  score: integer("score").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many, one }) => ({
  profile: one(userProfile),
  ownedProjects: many(project),
  groupMemberships: many(groupMember),
  discussionParticipants: many(participant),
  discussionMessages: many(discussionChat),
  progressUploads: many(progressUpload),
  assessmentsGiven: many(peerAssessment, { relationName: 'author' }),
  assessmentsReceived: many(peerAssessment, { relationName: 'subject' }),
}));

// Additional relations can be added here for nested queries
