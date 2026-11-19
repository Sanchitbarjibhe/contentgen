import JsonLdComponent from "@/components/JsonLd";

export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return <JsonLdComponent data={data} />;
}
