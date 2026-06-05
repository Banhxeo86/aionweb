'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../upload/admin.module.css';

const CATEGORIES = [
  { id: 'edu', name: '교육용자료' },
  { id: 'class', name: '학급운영자료' },
  { id: 'work', name: '업무/기타 자료' },
];

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('edu');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check Auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('관리자 로그인이 필요합니다.');
          router.push('/login');
          return;
        }
        setUser(session.user);

        // 2. Fetch Material
        const { data: material, error } = await supabase
          .from('materials')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        // Check ownership
        if (material.author_id !== session.user.id) {
          alert('수정 권한이 없습니다.');
          router.push('/');
          return;
        }

        // 3. Set State
        setTitle(material.title);
        setDescription(material.description);
        setCategory(material.category);
        setContent(material.content);
        setLinkUrl(material.link_url || '');
      } catch (error: any) {
        console.error('Error fetching data:', error);
        alert('데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      // 1. Data Update (Simplified: No files/thumbnails)
      const { error: dbError } = await supabase
        .from('materials')
        .update({
          title,
          description,
          category,
          content,
          link_url: linkUrl,
        })
        .eq('id', params.id);

      if (dbError) throw dbError;

      alert('자료가 성공적으로 수정되었습니다!');
      router.push(`/materials/detail/${params.id}`);
      router.refresh();
    } catch (error: any) {
      console.error('Update failed:', error);
      alert(`수정 실패: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={`glass ${styles.uploadCard}`}>
        <h1 className={styles.title}>자료 수정하기</h1>
        <p className={styles.subtitle}>등록된 자료의 내용을 수정합니다.</p>

        <form onSubmit={handleUpdate} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="자료 제목을 입력하세요"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>카테고리</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>짧은 설명</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="목록에 표시될 짧은 설명을 입력하세요"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>상세 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="자료에 대한 상세 설명을 입력하세요"
              rows={10}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>외부 링크 (웹앱 URL)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="클릭 시 이동할 외부 주소(https://...)를 입력하세요"
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              취소
            </button>
            <button type="submit" className="auth-btn" disabled={submitting}>
              {submitting ? '수정 중...' : '수정 완료하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
