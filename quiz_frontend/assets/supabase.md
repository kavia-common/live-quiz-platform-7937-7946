# Supabase Integration (Frontend)

This React app integrates with Supabase using environment variables:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

These variables must be provided by the orchestrator (do not commit actual values). The client is created in `src/services/supabaseClient.js`:

```js
import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  return createClient(url, key);
}
```

Usage example:
```js
import { getSupabaseClient } from "../services/supabaseClient";
const supabase = getSupabaseClient();
const { data, error } = await supabase.from("quiz_events").select("*");
```

Note:
- Ensure env vars are set in the container environment (.env). 
- If you change how the client is created, update this document to match.
