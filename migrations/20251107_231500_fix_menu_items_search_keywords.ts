import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Payload array fields use _order / _parent_id / varchar id — fix prior migration. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "menu_items_search_keywords" CASCADE;

  CREATE TABLE "menu_items_search_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );

  ALTER TABLE "menu_items_search_keywords" ADD CONSTRAINT "menu_items_search_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "menu_items_search_keywords_order_idx" ON "menu_items_search_keywords" USING btree ("_order");
  CREATE INDEX "menu_items_search_keywords_parent_id_idx" ON "menu_items_search_keywords" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "menu_items_search_keywords" CASCADE;
  `)
}
