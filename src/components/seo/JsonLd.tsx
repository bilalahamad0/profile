// Server component that renders one or more JSON-LD structured-data blocks as
// <script type="application/ld+json"> tags. Centralizes the repeated
// dangerouslySetInnerHTML boilerplate used across routes so the only thing a
// page supplies is the schema object(s) from `@/lib/structured-data`.

export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
