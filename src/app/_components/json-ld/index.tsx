import serialize from "serialize-javascript";

import type { Thing, WithContext } from "schema-dts";

interface JsonLdProps {
  data: WithContext<Thing>;
}

const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data, { isJSON: true }) }}
    />
  );
};

export default JsonLd;
