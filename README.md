# use-shortcut-lib Overview

A lightweight React utility for handling **keyboard shortcuts** — both **locally** (within focused elements) and **globally** (across the entire document).  
Implements single-key detection with optional debounce and fine control over which elements respond. 

## Installation

```bash
npm install use-shortcut-lib
# or
yarn add use-shortcut-lib

```

# Hooks and Component created

* useShortCut → A hook for local shortcuts, scoped to a specific element.

* useGlobalShortcut → A hook for global shortcuts, active across the whole document.

* <Shortcut> → A React component wrapper for easier integration in JS


# Usage Examples

useShortCut Hook

```tsx
import { useShortCut } from "use-shortcut-lib";

export function LocalExample() {
  const shortcutHandler = useShortCut(["j", "k"], (key) => {
    alert(`Pressed: ${key}`);
  });

  return (
    <div
      tabIndex={0}
      style={{ padding: "1rem", border: "1px solid gray" }}
      onKeyDown={(e) => shortcutHandler(e.nativeEvent)}
    >
      Focus this area and press <b>J</b> or <b>K</b>
    </div>
  );
}

```

<Shortcut> - Component

```tsx
import { Shortcut } from "use-shortcut-lib";

export function ShortcutComponentExample() {
  return (
    <Shortcut
      keys="Enter"
      onKey={() => alert("Enter pressed!")}
      options={{ preventDefault: true }}
    >
      <input />
    </Shortcut>
  );
}

```

useGlobalShortcut - Global shortcuts

```tsx
import { Shortcut } from "use-shortcut-lib";

export function ShortcutComponentExample() {
  return (
    <Shortcut
      keys="Enter"
      onKey={() => alert("Enter pressed!")}
      options={{ preventDefault: true }}
    >
      <input />
    </Shortcut>
  );
}

```

