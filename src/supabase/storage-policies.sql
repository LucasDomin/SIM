-- Execute after creating public buckets: images, videos, documents
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict (id) do nothing;

create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
create policy "Public read videos" on storage.objects for select using (bucket_id = 'videos');
create policy "Public read documents" on storage.objects for select using (bucket_id = 'documents');

create policy "Authenticated write images" on storage.objects for all using (bucket_id = 'images' and auth.role() = 'authenticated') with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Authenticated write videos" on storage.objects for all using (bucket_id = 'videos' and auth.role() = 'authenticated') with check (bucket_id = 'videos' and auth.role() = 'authenticated');
create policy "Authenticated write documents" on storage.objects for all using (bucket_id = 'documents' and auth.role() = 'authenticated') with check (bucket_id = 'documents' and auth.role() = 'authenticated');