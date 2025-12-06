import UsersFilter from '~/features/users/view-users/components/users-filter';
import UsersTable from '~/features/users/view-users/components/users-table';

const Page = () => {
  return (
    <div className='space-y-4'>
      <UsersFilter />
      <UsersTable />
    </div>
  );
};

export default Page;
