# FilterFormProps Reference

This document provides a formal reference for the `filterFormProps` property in Asset Selector, detailing its structure and supported properties.

## Overview

The `filterFormProps` object configures the behavior of the filter form UI in Asset Selector.

## Type Definition

The `FilterFormProps` interface has the following structure:

```typescript
interface FilterFormProps {
    defaultExpanded?: string[];
    [key: string]: any;  
}
```

## Core Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `defaultExpanded` | string[] | No | [] | Array of `groupKey` strings that will be expanded by default when the filter UI renders |

## Usage Considerations

1. **Group Expansion**: The `defaultExpanded` property is the most commonly used property. It controls which filter groups are expanded when the filter UI is first rendered.

2. **Additional Properties**: The component may accept other configuration properties for advanced customization. These properties depend on the implementation and should be used with caution.

## Example

```typescript
const filterFormProps = {
  defaultExpanded: ["FileTypeGroup", "MimeTypeGroup"]
};
```

This configuration will cause the filter groups with the keys "FileTypeGroup" and "MimeTypeGroup" to be expanded by default when the filter UI is rendered. 