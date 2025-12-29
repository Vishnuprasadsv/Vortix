
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'images' );

drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' ); 

drop policy if exists "Owner Update" on storage.objects;
create policy "Owner Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'images' AND auth.uid() = owner );

drop policy if exists "Owner Delete" on storage.objects;
create policy "Owner Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'images' AND auth.uid() = owner );
