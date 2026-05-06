'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

const CATEGORIES = [
  { id: 'edu', name: '교육용자료' },
  { id: 'class', name: '학급운영자료' },
  { id: 'work', name: '업무용자료' },
  { id: 'etc', name: '기타자료' },
];

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('edu');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('관리자 로그인이 필요합니다.');
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Data Insert to Supabase DB (Simplified: No files/thumbnails)
      const { error: dbError } = await supabase
        .from('materials')
        .insert([
          {
            title,
            description,
            category,
            content,
            link_url: linkUrl,
            author_id: user.id,
          },
        ]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw new Error(`데이터 저장 실패: ${dbError.message}`);
      }

      alert('자료가 성공적으로 업로드되었습니다!');
      router.push(`/materials/${category}`);
      router.refresh();
    } catch (error: any) {
      console.error('Full upload process error:', error);
      alert(`업로드 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={`glass ${styles.uploadCard}`}>
        <h1 className={styles.title}>새 자료 업로드</h1>
        <p className={styles.subtitle}>연구회원들과 공유할 새로운 자료를 등록하세요.</p>

        <form onSubmit={handleUpload} className={styles.form}>
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
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? '업로드 중...' : '자료 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
