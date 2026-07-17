'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ReviewSectionClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    // Listen to real-time changes
    const channel = supabase
      .channel('public:reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
        // Fetch the updated list to ensure we only get visible ones
        const fetchReviews = async () => {
          const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('is_visible', true)
            .order('created_at', { ascending: false });
          if (data) setReviews(data);
        };
        fetchReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase.from('reviews').insert([
      { visitor_name: name, rating, comment }
    ]);

    setIsSubmitting(false);

    if (error) {
      alert('Gagal mengirim review: ' + error.message);
    } else {
      setSuccessMsg('Terima kasih! Review Anda telah dikirim.');
      setName('');
      setComment('');
      setRating(5);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  return (
    <section className="review-section" id="reviews">
      <style>{`
        .review-section {
          padding: 6rem 5%;
          background: #fff;
          font-family: 'Inter', sans-serif;
        }
                  .testi-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .testi-header h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .testi-header h2 {
          font-size: 3rem;
          color: #2B1717;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .review-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        .review-header h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .review-header h2 {
          font-size: 2.5rem;
          color: #2B1717;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .review-form-card {
          background: #fafafa;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #f0f0f0;
        }
        .star-rating {
          display: flex;
          gap: 5px;
          margin-bottom: 1.5rem;
          font-size: 2rem;
          cursor: pointer;
        }
        .star-rating span {
          color: #e0e0e0;
          transition: color 0.2s;
        }
        .star-rating span.active {
          color: #f39c12;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-input {
          width: 100%;
          padding: 14px;
          border: 1px solid #ddd;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          outline: none;
          border-color: #FF6B35;
        }
        .btn-submit-review {
          background: #FF6B35;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          transition: background 0.3s, transform 0.2s;
        }
        .btn-submit-review:hover {
          background: #e85a25;
          transform: translateY(-2px);
        }
        .btn-submit-review:disabled {
          background: #ffb599;
          cursor: not-allowed;
          transform: none;
        }
        
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 10px;
          scrollbar-width: thin;
          scrollbar-color: #ddd transparent;
        }
        .reviews-list::-webkit-scrollbar {
          width: 6px;
        }
        .reviews-list::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 10px;
        }
        .review-item {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border-left: 4px solid #FF6B35;
        }
        .review-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .review-name {
          font-weight: 700;
          color: #2B1717;
        }
        .review-date {
          font-size: 0.8rem;
          color: #999;
        }
        .review-stars {
          color: #f39c12;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        .review-text {
          color: #555;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        @media (max-width: 991px) {
          .review-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
      `}</style>

      <div className="testi-header">
        <h4>Testimonial</h4>
        <h2>Apa Kata Mereka?</h2>
      </div>
      <div className="review-container">
        
        <div>
          <div className="review-header">
            <h4>Realtime Reviews</h4>
            <h2>Tinggalkan Pesan Untuk Kami</h2>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
              Masukan Anda sangat berarti bagi kami untuk terus memberikan kualitas dan pelayanan terbaik.
            </p>
          </div>

          <div className="review-form-card">
            {successMsg && (
              <div style={{ background: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                {successMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    className={(hoverRating || rating) >= star ? 'active' : ''}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Nama Anda" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <textarea 
                  className="form-input" 
                  placeholder="Bagaimana pengalaman Anda menikmati Svarga Dimsum?" 
                  rows={4} 
                  value={comment} 
                  onChange={e => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#2B1717' }}>
            Review Pelanggan ({reviews.length})
          </h3>
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                Belum ada review. Jadilah yang pertama!
              </div>
            ) : reviews.map(r => (
              <div key={r.id} className="review-item">
                <div className="review-item-header">
                  <div className="review-name">{r.visitor_name}</div>
                  <div className="review-date">{new Date(r.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div className="review-stars">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <div className="review-text">{r.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
