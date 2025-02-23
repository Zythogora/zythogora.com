import type { Path } from "./index";

/*
 * This is a modified version of the `generatePath` function from `react-router`.
 * It is used to generate a path from a route and a set of dynamic parameters.
 *
 * https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/router/utils.ts#L923
 */

// prettier-ignore
type Regex_az = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
// prettier-ignore
type Regez_AZ = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
type Regex_09 = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Regex_w = Regex_az | Regez_AZ | Regex_09 | "_";
type ParamChar = Regex_w | "-";

// Emulates regex `+`
type RegexMatchPlus<
  CharPattern extends string,
  T extends string,
> = T extends `${infer First}${infer Rest}`
  ? First extends CharPattern
    ? RegexMatchPlus<CharPattern, Rest> extends never
      ? First
      : `${First}${RegexMatchPlus<CharPattern, Rest>}`
    : never
  : never;

// Recursive helper for finding path parameters in the absence of wildcards
type _PathParam<Path extends string> =
  // split path into individual path segments
  Path extends `${infer L}/${infer R}`
    ? _PathParam<L> | _PathParam<R>
    : // find params after `:`
      Path extends `:${infer Param}`
      ? Param extends `${infer Optional}?${string}`
        ? RegexMatchPlus<ParamChar, Optional>
        : RegexMatchPlus<ParamChar, Param>
      : // otherwise, there aren't any params present
        never;

export type PathParam<Path extends string> =
  // check if path is just a wildcard
  Path extends "*" | "/*"
    ? "*"
    : // look for wildcard at the end of the path
      Path extends `${infer Rest}/*`
      ? "*" | _PathParam<Rest>
      : // look for params in the absence of wildcards
        _PathParam<Path>;

export type Params<Path extends string> = {
  [key in PathParam<Path>]: string | null;
};

export const generatePath = <P extends Path>(
  originalPath: P,
  params: Params<P> = {} as Params<P>,
): string => {
  let path: string = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    console.warn(
      false,
      `Route path "${path}" will be treated as if it were ` +
        `"${path.replace(/\*$/, "/*")}" because the \`*\` character must ` +
        `always follow a \`/\` in the pattern. To get rid of this warning, ` +
        `please change the route path to "${path.replace(/\*$/, "/*")}".`,
    );
    path = path.replace(/\*$/, "/*") as Path;
  }

  // ensure `/` is added at the beginning if the path is absolute
  const prefix = path.startsWith("/") ? "/" : "";

  const stringify = (p: unknown) =>
    p == null ? "" : typeof p === "string" ? p : String(p);

  const segments = path
    .split(/\/+/)
    .map((segment, index, array) => {
      const isLastSegment = index === array.length - 1;

      // only apply the splat if it's the last segment
      if (isLastSegment && segment === "*") {
        const star = "*" as PathParam<P>;
        // Apply the splat
        return stringify(params[star]);
      }

      const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
      if (keyMatch) {
        const [, key, optional] = keyMatch;
        const param = params[key as PathParam<P>];

        if (optional !== "?" && param === null) {
          throw new Error(`Missing ":${key}" param`);
        }
        return stringify(param);
      }

      // Remove any optional markers from optional static segments
      return segment.replace(/\?$/g, "");
    })
    // Remove empty segments
    .filter((segment) => !!segment);

  return prefix + segments.join("/");
};
