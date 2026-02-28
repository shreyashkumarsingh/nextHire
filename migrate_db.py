"""
Migrate data from a local SQLite database to PostgreSQL.

Usage examples:
  python migrate_db.py --sqlite sqlite:///nexthire.db --postgres postgresql://user:pass@localhost:5432/nexthire
  python migrate_db.py  # uses SQLITE_URL and DATABASE_URL from environment
"""
import argparse
import os

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from models import db, User, UserProfile, Resume, ResumeSkill, Education, Experience


def parse_args():
    parser = argparse.ArgumentParser(description="Migrate SQLite data to PostgreSQL")
    parser.add_argument(
        "--sqlite",
        dest="sqlite_url",
        default=os.getenv("SQLITE_URL", "sqlite:///nexthire.db"),
        help="SQLite connection URL (default: sqlite:///nexthire.db)",
    )
    parser.add_argument(
        "--postgres",
        dest="postgres_url",
        default=os.getenv("DATABASE_URL"),
        help="PostgreSQL connection URL (default: DATABASE_URL env var)",
    )
    return parser.parse_args()


def copy_table(model, source_session, target_session):
    rows = source_session.query(model).all()
    inserted = 0

    for row in rows:
        existing = target_session.get(model, row.id)
        if existing:
            continue

        data = {col.name: getattr(row, col.name) for col in model.__table__.columns}
        target_session.add(model(**data))
        inserted += 1

    target_session.commit()
    return inserted


def reset_sequence(target_session, table_name, pk_column="id"):
    target_session.execute(
        text(
            "SELECT setval(pg_get_serial_sequence(:table, :pk), "
            "COALESCE((SELECT MAX(" + pk_column + ") FROM " + table_name + "), 1))"
        ),
        {"table": table_name, "pk": pk_column},
    )


def main():
    args = parse_args()

    if not args.postgres_url:
        raise SystemExit("Missing PostgreSQL URL. Set DATABASE_URL or use --postgres.")

    sqlite_engine = create_engine(args.sqlite_url)
    postgres_engine = create_engine(args.postgres_url)

    db.metadata.create_all(postgres_engine)

    SourceSession = sessionmaker(bind=sqlite_engine)
    TargetSession = sessionmaker(bind=postgres_engine)

    source_session = SourceSession()
    target_session = TargetSession()

    try:
        print("Migrating users...")
        users = copy_table(User, source_session, target_session)
        print(f"  Inserted: {users}")

        print("Migrating user profiles...")
        profiles = copy_table(UserProfile, source_session, target_session)
        print(f"  Inserted: {profiles}")

        print("Migrating resumes...")
        resumes = copy_table(Resume, source_session, target_session)
        print(f"  Inserted: {resumes}")

        print("Migrating resume skills...")
        skills = copy_table(ResumeSkill, source_session, target_session)
        print(f"  Inserted: {skills}")

        print("Migrating education...")
        education = copy_table(Education, source_session, target_session)
        print(f"  Inserted: {education}")

        print("Migrating experience...")
        experience = copy_table(Experience, source_session, target_session)
        print(f"  Inserted: {experience}")

        if postgres_engine.dialect.name == "postgresql":
            reset_sequence(target_session, "users")
            reset_sequence(target_session, "user_profiles")
            reset_sequence(target_session, "resumes")
            reset_sequence(target_session, "resume_skills")
            reset_sequence(target_session, "education")
            reset_sequence(target_session, "experience")
            target_session.commit()

        print("Migration completed successfully.")
    finally:
        source_session.close()
        target_session.close()


if __name__ == "__main__":
    main()
