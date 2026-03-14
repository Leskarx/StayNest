import React from 'react';
import { Star } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function ReviewCard({ review }) {
  const { user, rating, comment, createdAt, cleanliness, communication, location: locScore, value } = review;

  const subRatings = [
    { label: 'Cleanliness', value: cleanliness },
    { label: 'Communication', value: communication },
    { label: 'Location', value: locScore },
    { label: 'Value', value: value },
  ].filter((r) => r.value);

  return (
    <div className="border-b border-slate-100 pb-6 last:border-0">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={
            user?.profileImage?.url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2563EB&color=fff&size=40`
          }
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border border-slate-100"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0F172A]">{user?.name || 'Anonymous'}</p>
            {createdAt && <p className="text-xs text-slate-400">{formatDate(createdAt)}</p>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {comment && <p className="text-sm text-slate-600 leading-relaxed mb-3">{comment}</p>}

      {subRatings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {subRatings.map((r) => (
            <div key={r.label} className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-xs text-slate-400 mb-1">{r.label}</p>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full"
                    style={{ width: `${(r.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
