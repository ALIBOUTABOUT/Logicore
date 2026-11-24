import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Input, Textarea, Select, Button, Modal, toast } from '../ui';
import { eventSchema, type EventSchema } from '../../utils/validation';
import { createEvent, updateEvent, uploadEventImage, validateImageFile } from '../../lib/api/events';
import type { Event } from '../../types';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect fill='%23EFECE4' width='200' height='120'/%3E%3Ctext x='100' y='65' fill='%230A2463' opacity='0.4' text-anchor='middle' font-size='11' font-family='monospace'%3ENo image%3C/text%3E%3C/svg%3E";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: Event | null;
}

export function EventFormModal({ isOpen, onClose, onSuccess, event }: EventFormModalProps) {
  const isEditing = !!event;
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      short_description: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      status: 'upcoming',
      cover_image_url: '',
      gallery_urls: [],
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (event) {
      reset({
        title:             event.title,
        short_description: event.short_description ?? '',
        description:       event.description ?? '',
        event_date:        event.event_date,
        start_time:        event.start_time ? event.start_time.slice(0, 5) : '',
        end_time:          event.end_time ? event.end_time.slice(0, 5) : '',
        location:          event.location ?? '',
        status:            event.status,
        cover_image_url:   event.cover_image_url ?? '',
        gallery_urls:      event.gallery_urls ?? [],
      });
      setCoverPreview(event.cover_image_url ?? '');
      setGalleryPreviews(event.gallery_urls ?? []);
    } else {
      reset({
        title: '',
        short_description: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        status: 'upcoming',
        cover_image_url: '',
        gallery_urls: [],
      });
      setCoverPreview('');
      setGalleryPreviews([]);
    }
  }, [isOpen, event, reset]);

  const currentStatus = watch('status');

  const handleCoverUpload = async (file: File) => {
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    setCoverUploading(true);
    const result = await uploadEventImage(file, 'covers');
    setCoverUploading(false);
    if (result.error) { toast.error(result.error); return; }
    setCoverPreview(result.data!.url);
    setValue('cover_image_url', result.data!.url);
    toast.success('Cover image uploaded');
  };

  const handleGalleryUpload = async (files: FileList) => {
    setGalleryUploading(true);
    const urls: string[] = [...galleryPreviews];
    let uploadedCount = 0;
    for (const file of Array.from(files)) {
      const err = validateImageFile(file);
      if (err) { toast.error(`${file.name}: ${err}`); continue; }
      const result = await uploadEventImage(file, 'gallery');
      if (result.error) { toast.error(result.error); continue; }
      urls.push(result.data!.url);
      uploadedCount++;
    }
    setGalleryUploading(false);
    setGalleryPreviews(urls);
    setValue('gallery_urls', urls);
    if (uploadedCount > 0) toast.success(`${uploadedCount} gallery photo${uploadedCount > 1 ? 's' : ''} uploaded`);
  };

  const removeGalleryImage = (idx: number) => {
    const updated = galleryPreviews.filter((_, i) => i !== idx);
    setGalleryPreviews(updated);
    setValue('gallery_urls', updated);
  };

  const onSubmit = async (data: EventSchema) => {
    const payload = {
      ...data,
      gallery_urls: currentStatus === 'archived' ? galleryPreviews : [],
    };
    const result = isEditing
      ? await updateEvent(event!.id, payload)
      : await createEvent(payload);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isEditing ? 'Event updated!' : 'Event created!');
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Event' : 'New Event'} size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        <Input label="Title" error={errors.title?.message} required placeholder="Event title" {...register('title')} />

        <Input label="Date" type="date" error={errors.event_date?.message} required {...register('event_date')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Start Time" type="time" error={errors.start_time?.message} {...register('start_time')} />
          <Input label="End Time (optional)" type="time" error={errors.end_time?.message} {...register('end_time')} />
        </div>

        <Input label="Location" placeholder="Room / Building / Online" error={errors.location?.message} {...register('location')} />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'archived', label: 'Archived' },
              ]}
              error={errors.status?.message}
              {...field}
            />
          )}
        />

        <Textarea
          label="Short Description"
          placeholder="A brief one-line summary (shown on event cards)"
          rows={2}
          error={errors.short_description?.message}
          {...register('short_description')}
        />

        <Textarea
          label="Full Description"
          placeholder="Detailed description of the event…"
          rows={5}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Cover image upload */}
        <div>
          <span className="font-mono text-xs uppercase tracking-wider font-medium text-ink block mb-2">
            Cover Image
          </span>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-40 h-24 rounded-sm overflow-hidden bg-paper-tint border border-rule shrink-0">
              <img
                src={coverPreview || PLACEHOLDER_IMG}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={coverRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => {
                  if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={coverUploading}
                onClick={() => coverRef.current?.click()}
              >
                <Upload className="w-4 h-4" /> Upload Cover
              </Button>
              {coverPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setCoverPreview(''); setValue('cover_image_url', ''); }}
                >
                  <X className="w-4 h-4" /> Remove
                </Button>
              )}
              <p className="font-mono text-[11px] text-ink-subtle">JPG, PNG, WebP · max 5 MB</p>
            </div>
          </div>
        </div>

        {/* Gallery — shown when status is archived */}
        {currentStatus === 'archived' ? (
          <div>
            <span className="font-mono text-xs uppercase tracking-wider font-medium text-ink block mb-2">
              Gallery Photos <span className="text-ink-subtle font-normal">(for archived events)</span>
            </span>
            <div className="flex flex-wrap gap-3 mb-3">
              {galleryPreviews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden bg-paper-tint border border-rule group">
                  <img
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-[#B42318] rounded-sm flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove gallery image ${i + 1}`}
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={galleryUploading}
                className="w-20 h-20 rounded-sm border border-dashed border-ink/25 hover:border-navy-900 flex flex-col items-center justify-center gap-1 text-ink-subtle hover:text-navy-900 transition-colors"
                aria-label="Add gallery images"
              >
                {galleryUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-mono text-[11px]">Add</span>
                  </>
                )}
              </button>
            </div>
            <input
              ref={galleryRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files?.length) handleGalleryUpload(e.target.files);
                e.target.value = '';
              }}
            />
            <p className="font-mono text-[11px] text-ink-subtle">Multiple files allowed · JPG, PNG, WebP · max 5 MB each</p>
          </div>
        ) : (
          <div className="p-3 rounded-sm bg-paper border border-rule text-xs text-ink-muted">
            Gallery photos become available when the event status is set to <strong className="text-ink">Archived</strong>.
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-rule">
          <Button type="submit" loading={isSubmitting} disabled={coverUploading || galleryUploading} className="flex-1">
            {isEditing ? 'Save Changes' : 'Create Event'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
