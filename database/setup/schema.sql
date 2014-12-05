-- Table: "Comments"

-- DROP TABLE "Comments";

CREATE TABLE "Comments"
(
  "CommentID" SERIAL,
  "PinnID" integer NOT NULL,
  "Comment" text,
  "Up" integer NOT NULL DEFAULT 0,
  "Down" integer NOT NULL DEFAULT 0,
  "SessionID" text NOT NULL,
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
  "PinnID" SERIAL,
  "Active" integer NOT NULL DEFAULT 1,
  "Latitude" double precision NOT NULL,
  "Longitude" double precision NOT NULL,
  "EventName" text,
  "Description" text,
  "SessionID" text,
  "Up" integer NOT NULL DEFAULT 0,
  "Down" integer NOT NULL DEFAULT 0,
  "Time" timestamp without time zone NOT NULL,
  CONSTRAINT "Pinns_pkey" PRIMARY KEY ("PinnID")
)
WITH (
  OIDS=FALSE
);
