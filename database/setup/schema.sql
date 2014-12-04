-- Table: "Comments"

-- DROP TABLE "Comments";

CREATE TABLE "Comments"
(
  "CommentID" integer NOT NULL,
  "PinnID" integer NOT NULL,
  "Comment" text,
  "Up" integer NOT NULL DEFAULT 0,
  "Down" integer NOT NULL DEFAULT 0,
  "SessionID" integer NOT NULL,
  "Time" timestamp(6) without time zone NOT NULL,
  CONSTRAINT "Comments_pkey" PRIMARY KEY ("CommentID")
)
WITH (
  OIDS=FALSE
);
  
-- Table: "Pinns"

-- DROP TABLE "Pinns";

CREATE TABLE "Pinns"
(
  "PinnID" integer NOT NULL,
  "Active" integer NOT NULL DEFAULT 1,
  "Latitude" real NOT NULL,
  "Longitude" real NOT NULL,
  "EventName" text,
  "Description" text,
  "SessionID" integer,
  "Up" integer NOT NULL DEFAULT 0,
  "Down" integer NOT NULL DEFAULT 0,
  "Time" timestamp without time zone NOT NULL,
  CONSTRAINT "Pinns_pkey" PRIMARY KEY ("PinnID")
)
WITH (
  OIDS=FALSE
);
