--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.3.5
-- Started on 2014-12-02 18:02:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 1944 (class 1262 OID 24576)
-- Name: pinndit; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE pinndit WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';


ALTER DATABASE pinndit OWNER TO postgres;

\connect pinndit

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 172 (class 3079 OID 11750)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 1947 (class 0 OID 0)
-- Dependencies: 172
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = true;

--
-- TOC entry 171 (class 1259 OID 24593)
-- Name: Comments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "Comments" (
    "PinnID" integer NOT NULL,
    "Comment" text,
    "Up" integer DEFAULT 0 NOT NULL,
    "Down" integer DEFAULT 0 NOT NULL,
    "SessionID" integer NOT NULL,
    "OID" oid,
    "Time" timestamp(6) without time zone NOT NULL
);


ALTER TABLE public."Comments" OWNER TO postgres;

--
-- TOC entry 170 (class 1259 OID 24577)
-- Name: Pinns; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "Pinns" (
    "Latitude" real NOT NULL,
    "Longitude" real NOT NULL,
    "Description" text,
    "Event Name" text,
    "SessionID" integer,
    "Up" integer DEFAULT 0 NOT NULL,
    "Down" integer DEFAULT 0 NOT NULL,
    "Time" timestamp without time zone NOT NULL,
    "PinnID" integer
);


ALTER TABLE public."Pinns" OWNER TO postgres;

--
-- TOC entry 1939 (class 0 OID 24593)
-- Dependencies: 171
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "Comments" VALUES (1, 'TestComment', 0, 0, 100, 1, '2014-01-08 04:05:06');


--
-- TOC entry 1938 (class 0 OID 24577)
-- Dependencies: 170
-- Data for Name: Pinns; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "Pinns" VALUES (60, 60, NULL, 'Party', 100, 0, 0, '2014-01-08 04:05:06', 1);
INSERT INTO "Pinns" VALUES (70, 70, 'second event', 'Event2', 100, 0, 0, '2014-01-08 04:05:06', 2);
INSERT INTO "Pinns" VALUES (67, 67, NULL, 'Event3', 101, 0, 0, '2014-01-08 04:05:06', 3);


--
-- TOC entry 1946 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2014-12-02 18:02:49

--
-- PostgreSQL database dump complete
--

