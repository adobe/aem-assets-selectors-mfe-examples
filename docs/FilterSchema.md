# FilterSchema Reference

This document provides a formal reference for the `filterSchema` property in Asset Selector, including all supported types, field properties, and their descriptions.

## Type Definitions

### FilterSchema

The `filterSchema` is an array of `FilterGroup` objects:

```typescript
type FilterSchema = FilterGroup[];
```

### FilterGroup

Each `FilterGroup` represents a section of filters in the UI:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `header` | string | Yes | - | The display title of the filter group |
| `groupKey` | string | Yes | - | Unique identifier for the group, used for referencing in `filterFormProps.defaultExpanded` |
| `fields` | FilterField[] | Yes | - | Array of field definitions for this group |

### FilterField

The `FilterField` type defines a single filter field:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `element` | string | Yes | - | Type of field. Valid values: "checkbox", "radiogroup", "Number", "taggroup" |
| `name` | string | Yes | - | Parameter name used in filter queries |
| `defaultValue` | DefaultValue | No | - | Pre-selected values when filter initializes |
| `options` | FilterFieldOption[] | Yes (for checkbox/radiogroup) | - | Array of option objects for selection fields |
| `orientation` | string | No | "horizontal" | Layout orientation. Valid values: "horizontal", "vertical" |
| `columns` | number | No | 1 | Number of columns for layout |
| `readOnly` | boolean | No | false | Makes the entire field read-only if true |
| `excludeTags` | string[] | No | [] | Values to exclude from filtering |
| `range` | boolean | No | false | For Number fields, enables min/max range selection |
| `quiet` | boolean | No | false | For Number fields, applies a quieter visual style |
| `label` | string | No | - | Display label for the field |
| `hideArrows` | boolean | No | false | For Number fields, hides increment/decrement arrows |
| `fieldType` | string | No | - | For taggroup, must be "tag-group" |

### FilterFieldOption

Options used within checkbox and radiogroup fields:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | string | Yes | - | Display text shown to users |
| `value` | string | Yes | - | Value used in filter queries |
| `readOnly` | boolean | No | false | Makes this specific option read-only |
| `disabled` | boolean | No | false | Disables this specific option |

### DefaultValue

The `defaultValue` type can take different forms depending on the field type:

For checkbox/radiogroup fields:
```typescript
type DefaultValue = string[];
```

For Number fields with range:
```typescript
type DefaultValueObject = {
  min?: number;
  max?: number;
};

type DefaultValue = DefaultValueObject[];
```

For date range fields:
```typescript
type DefaultValueDateRange = {
  start: string;
  end: string;
};

type DefaultValue = DefaultValueDateRange;
```

## Element Type-Specific Properties

### Checkbox Field

A field with multiple selectable options.

**Required Properties:**
- `element`: "checkbox"
- `name`: string
- `options`: FilterFieldOption[]

**Optional Properties:**
- `defaultValue`: string[] - Array of pre-selected values
- `orientation`: "horizontal" | "vertical"
- `columns`: number
- `readOnly`: boolean
- `excludeTags`: string[]

### Radio Group Field

A field with single selection from a list of options.

**Required Properties:**
- `element`: "radiogroup"
- `name`: string
- `options`: FilterFieldOption[]

**Optional Properties:**
- `defaultValue`: string[] - Array containing a single pre-selected value
- `orientation`: "horizontal" | "vertical"
- `excludeTags`: string[]

### Number Field

A numeric input field, optionally with range selection.

**Required Properties:**
- `element`: "Number"
- `name`: string

**Optional Properties:**
- `range`: boolean - Enables min/max range selection
- `label`: string
- `orientation`: "horizontal" | "vertical"
- `quiet`: boolean
- `hideArrows`: boolean
- `columns`: number
- `defaultValue`: DefaultValueObject[] - Default range values with min/max properties

### Tag Group Field

A field for selecting tags from the AEM tag hierarchy.

**Required Properties:**
- `element`: "taggroup"
- `name`: string (typically "property=xcm:keywords=")
- `fieldType`: "tag-group"

## FilterSchema Example Shape

```typescript
// Complete schema structure example
const filterSchema: FilterSchema = [
  {
    header: string,
    groupKey: string,
    fields: [
      {
        element: "checkbox" | "radiogroup" | "Number" | "taggroup",
        name: string,
        defaultValue?: string[] | DefaultValueObject[] | DefaultValueDateRange,
        options?: FilterFieldOption[],
        orientation?: "horizontal" | "vertical",
        columns?: number,
        readOnly?: boolean,
        excludeTags?: string[],
        range?: boolean,
        quiet?: boolean,
        label?: string,
        hideArrows?: boolean,
        fieldType?: string
      }
    ]
  }
];
``` 