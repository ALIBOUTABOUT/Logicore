import { useState, useEffect, useRef } from 'react';
import { Archive, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { Button, Modal, Textarea, toast } from '../ui';
import { archiveEvent, uploadEventImage, validateImageFile } from '../../lib/api/events';
import type { Event } from '../../types';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect fill='%23EFECE4' width='120' height='120'/%3E%3C/svg%3E";

interface ArchiveEventModalProps {
  event: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ArchiveEventModal({ event, onClose, onSuccess }: ArchiveEventModalProps) {
  const [description, setDescription] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event) {
      setDescription(event.description ?? '');
      setGalleryUrls(event.gallery_urls ?? []);
    }
  }, [event]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const urls = [...galleryUrls];
    let count = 0;
    for (const file of Array.from(files)) {
      const err = validateImageFile(file);
      if (err) { toast.error(`${file.name}: ${err}`); continue; }
      const res = await uploadEventImage(file, 'gallery');
      if (res.error) { toast.error(res.error); continue; }
      urls.push(res.data!.url);
      count++;
    }
    setUploading(false);
    setGalleryUrls(urls);
    if (count > 0) toast.success(`Uploaded ${count} photo${count > 1 ? 's' : ''}`);
  };

  const removePhoto = (idx: number) => {
    setGalleryUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleArchive = async () => {
    if (!event) return;
    setSaving(true);
    const result = await archiveEvent(event.id, {
      description: description.trim() || undefined,
      gallery_urls: galleryUrls,
    });
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Event moved to archive');
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal isOpen={!!event} onClose={onClose} title="Move Event to Archive" size="lg">
      {event && (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          <p className="text-ink-muted text-sm leading-relaxed">
            Archive <strong className="text-ink">{event.title}</strong>. Add a final recap
            description and upload photos from the event before publishing to the archive.
          </p>

          <Textarea
            label="Final Event Description / Recap"
            placeholder="Share a summary of how the event went, key highlights, speakers, etc."
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div>
            <span className="font-mono text-xs uppercase tracking-wider font-medium text-ink block mb-2">
              Event Gallery Photos
            </span>
            <div className="flex flex-wrap gap-3 mb-3">
              {galleryUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden bg-paper-tint border border-rule group">
                  <img
                    src={url}
                    alt={`Event photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-[#B42318] rounded-sm flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-sm border border-dashed border-ink/25 hover:border-navy-900 flex flex-col items-center justify-center gap-1 text-ink-subtle hover:text-navy-900 transition-colors"
                aria-label="Add gallery photos"
              >
                {uploading ? (
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
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files?.length) handleUpload(e.target.files);
                e.target.value = '';
              }}
            />
            <p className="font-mono text-[11px] text-ink-subtle">JPG, PNG, WebP · max 5 MB each</p>
          </div>

          <div className="flex gap-3 pt-2 border-t border-rule">
            <Button loading={saving} disabled={uploading} onClick={handleArchive} className="flex-1">
              <Archive className="w-4 h-4" /> Publish to Archive
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
