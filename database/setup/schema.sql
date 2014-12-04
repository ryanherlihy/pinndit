CREATE TABLE "Comments" (
	"CommentID" integer PRIMARY KEY,
    "PinnID" integer NOT NULL,
    "Comment" text,
    "Up" integer DEFAULT 0 NOT NULL,
    "Down" integer DEFAULT 0 NOT NULL,
    "SessionID" integer NOT NULL,
    "Time" timestamp(6) without time zone NOT NULL
);


CREATE TABLE "Pinns" (
    "PinnID" integer PRIMARY KEY,
	"Active" integer DEFAULT 1 NOT NULL,
    "Latitude" real NOT NULL,
    "Longitude" real NOT NULL,
    "EventName" text,
	"Description" text,
    "SessionID" integer,
    "Up" integer DEFAULT 0 NOT NULL,
    "Down" integer DEFAULT 0 NOT NULL,
    "Time" timestamp without time zone NOT NULL
);
