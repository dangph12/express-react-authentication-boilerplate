## UI Components

### Multi-Select

In ui folder there is a multi-select component from @wds/multi-select (Web Dev Simplified Shadcn registry).

Usage:

```jsx
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from '~/components/ui/multi-select';

<MultiSelect>
  <MultiSelectTrigger className='w-full'>
    <MultiSelectValue placeholder='Select items...' />
  </MultiSelectTrigger>
  <MultiSelectContent>
    <MultiSelectGroup>
      <MultiSelectItem value='option1'>Option 1</MultiSelectItem>
      <MultiSelectItem value='option2'>Option 2</MultiSelectItem>
    </MultiSelectGroup>
  </MultiSelectContent>
</MultiSelect>;
```
