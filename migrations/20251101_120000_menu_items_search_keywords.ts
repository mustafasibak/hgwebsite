import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "menu_items_search_keywords" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );

  ALTER TABLE "menu_items_search_keywords" ADD CONSTRAINT "menu_items_search_keywords_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "menu_items_search_keywords_order_idx" ON "menu_items_search_keywords" USING btree ("order");
  CREATE INDEX "menu_items_search_keywords_parent_idx" ON "menu_items_search_keywords" USING btree ("parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "menu_items_search_keywords" CASCADE;
  `)
}
