import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue
} from '~/components/ui/multi-select';
import { GENDER_OPTIONS } from '~/constants/gender';
import { ROLE_OPTIONS } from '~/constants/role';

const UsersFilter = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get('name') || '';
  const gender = searchParams.getAll('gender') || [];
  const role = searchParams.getAll('role') || [];

  const form = useForm({
    defaultValues: {
      name,
      gender,
      role
    }
  });

  const handleSearch = data => {
    const newParams = new URLSearchParams();

    if (data.name) newParams.set('name', data.name);
    if (data.gender?.length) {
      data.gender.forEach(g => newParams.append('gender', g));
    }
    if (data.role?.length) {
      data.role.forEach(r => newParams.append('role', r));
    }

    newParams.set('page', '1');

    const sort = searchParams.get('sort');
    if (sort) newParams.set('sort', sort);

    setSearchParams(newParams);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSearch)} className='space-y-4'>
        <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full sm:w-64'>
                <FormControl>
                  <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search by name...'
                      className='pl-8'
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <MultiSelect
                  values={field.value}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className='w-full sm:w-40'>
                    <MultiSelectValue placeholder='Gender' />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {GENDER_OPTIONS.map(option => (
                        <MultiSelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <MultiSelect
                  values={field.value}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className='w-full sm:w-40'>
                    <MultiSelectValue placeholder='Role' />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {ROLE_OPTIONS.map(option => (
                        <MultiSelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </FormItem>
            )}
          />
          <Button type='submit'>
            <Search className='mr-2 h-4 w-4' />
            Search
          </Button>
          <Button
            type='button'
            onClick={() => navigate('/admin/manage-users/create-user')}
            className='sm:ml-auto'
          >
            <Plus className='mr-2 h-4 w-4' />
            Create User
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UsersFilter;
