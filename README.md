# deco live — the edge-native CMS

Live is the edge-native CMS based on fresh.
It lets your business users live edit any fresh site.

Want to create a Live Site? Use the [deco start template repo](https://github.com/deco-pages/start) to create a new site. Clone it and run `deno task start`. That's it.

## Adding live to an existing fresh site

Add the `$live` import to your `import_map.json` file:

```json
{
  "imports": {
    "$live/": "https://deno.land/x/live@0.0.8/",
    "(...)": "(...)"
  }
}
```

Then replace your `routes/index.tsx` file with this:

```tsx
/** @jsx h */
import { h } from "preact";
import { createLiveRoute } from "$live/live.tsx";
import Placeholder from "../components/Placeholder.tsx";

export const { handler, LiveRoute } = createLiveRoute(() => <Placeholder />);
export default LiveRoute;
```

Add the fallback route at: `routes/[...path].tsx` with this:

```tsx
import LiveRoute from "./index.tsx";
export * from "./index.tsx";
export default LiveRoute;
```

And finally, create the `live.ts` file with this:

```ts
import manifest from "./deco.gen.ts";
import { start } from "$live/server.ts";

await start(manifest, {
  site: "deco",
  domains: ["deco.cx"],
});
```

Replacing `site` and `domains` for your own values. Haven't created a site yet? Go to `deco.cx` and create one for free.

**PROTIP:** When you create a site on `deco.cx`, you automatically get a working repository at `deco-pages/<your-site>`. You can clone it, start coding your components and deploying right away, with zero setup.

## Live scripts

Live ships some utilitary scripts which you can add to your project as needed.

### HTML to Component script

You can use the `component` script to **transform any HTML in your clipboard** into a Preact component.

Add the `component` task to your `deno.json` file:

```json
{
  "tasks": {
    "start": "(...)",
    "component": "deno eval 'import \"$live/scripts/component.ts\"'"
  },
  "importMap": "./import_map.json"
}
```

Then copy some HTML into your clipboard. For example:

```html
<div>
  <span>Hello World</span>
  <img src="/test.jpg"> 
  <!-- note the unclosed img tag, which is invalid JSX -->
</div>
```

Then run the `component` task passing the ComponentName as first argument:

```bash
deno task component MyTestComponent
```

The new component will be generated in `./components/MyTestComponent.tsx` and should look like this:

```jsx
/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";

export default function MyTestComponent() {
  return (
    <div>
      <span>Hello World</span>
      <img src="/test.jpg" />{" "}
      {/* note the closed img tag! */}
    </div>
  );
}
```

Aditionally, the import snippet will replace your clipboard content:

```jsx
import MyTestComponent from '../components/MyTestComponent.tsx';
```

## Local development

- `cd examples/counter`
- Create an `.env` file with:

```bash
SUPABASE_KEY=...
SUPABASE_ACCOUNT=...
DECO_SITE=...
```

- `deno task start`

Now browse:

`http://localhost:8080/` for a dynamic page
`http://localhost:8080/test` for a static page
