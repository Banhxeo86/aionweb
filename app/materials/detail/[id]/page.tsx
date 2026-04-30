'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Download, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './detail.module.css';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setMaterial(data);
      } catch (error) {
        console.error('Error fetching material:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMaterial();
    }
  }, [params.id]);

  if (loading) {
    return <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>로딩 중...</div>;
  }

  if (!material) {
    return (
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h2>자료를 찾을 수 없습니다.</h2>
        <button onClick={() => router.back()} className="auth-btn" style={{ marginTop: '2rem' }}>
          돌아가기
        </button>
      </div>
    );
  }

  const categoryName = {
    edu: '교육용자료',
    class: '학급운영자료',
    work: '업무용자료',
    etc: '기타자료'
  }[material.category as keyof typeof categoryName] || '기타자료';

  return (
    <div className={`fade-in ${styles.container}`}>
      <Link href="/" className={styles.backBtn}>
        <ChevronLeft size={20} />
        목록으로 돌아가기
      </Link>

      <div className={`glass ${styles.detailCard}`}>
        <div className={styles.thumbnailArea}>
          {material.thumbnail_url ? (
            <img src={material.thumbnail_url} alt={material.title} className={styles.thumbnail} />
          ) : (
            <div className={styles.noThumbnail}>
              <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <span>AI-ON Research Group</span>
            </div>
          )}
        </div>

        <div className={styles.contentArea}>
          <header className={styles.header}>
            <span className={styles.categoryBadge}>{categoryName}</span>
            <h1 className={styles.title}>{material.title}</h1>
            <div className={styles.meta}>
              <span>등록일: {new Date(material.created_at).toLocaleDateString()}</span>
            </div>
          </header>

          <p className={styles.description}>{material.description}</p>
          
          <div className={styles.mainContent}>
            {material.content}
          </div>

          <div className={styles.actions}>
            {material.link_url && (
              <a href={material.link_url} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                <ExternalLink size={20} />
                자료 사이트로 이동하기
              </a>
            )}
            
            {material.file_url && (
              <a href={material.file_url} download className={styles.fileBtn}>
                <Download size={20} />
                첨부 파일 다운로드
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
