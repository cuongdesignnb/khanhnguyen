DO $migration$
DECLARE
  column_record record;
  statement text;
BEGIN
  FOR column_record IN
    SELECT table_schema, table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('character varying', 'text', 'json', 'jsonb')
  LOOP
    IF column_record.data_type IN ('json', 'jsonb') THEN
      statement := format(
        'UPDATE %I.%I SET %I = replace(replace(replace(%I::text, $1, $2), $3, $4), $5, $6)::%s WHERE %I::text ILIKE $7',
        column_record.table_schema,
        column_record.table_name,
        column_record.column_name,
        column_record.column_name,
        column_record.data_type,
        column_record.column_name
      );
    ELSE
      statement := format(
        'UPDATE %I.%I SET %I = replace(replace(replace(%I, $1, $2), $3, $4), $5, $6) WHERE %I ILIKE $7',
        column_record.table_schema,
        column_record.table_name,
        column_record.column_name,
        column_record.column_name,
        column_record.column_name
      );
    END IF;

    EXECUTE statement USING
      'KHÁNH NGUYÊN', 'KHANH NGUYÊN',
      'Khánh Nguyên', 'Khanh Nguyên',
      'khánh nguyên', 'khanh nguyên',
      '%khánh nguyên%';
  END LOOP;
END
$migration$;
