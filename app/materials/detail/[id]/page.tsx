'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Download, FileText, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './detail.module.css';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Material
        const { data: materialData, error: materialError } = await supabase
          .from('materials')
          .select('*')
          .eq('id', params.id)
          .single();

        if (materialError) throw materialError;
        setMaterial(materialData);

        // 2. Fetch User Session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching material:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 자료를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id);

      if (error) throw error;

      alert('자료가 삭제되었습니다.');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      alert(`삭제 실패: ${error.message}`);
    }
  };

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

  const categoryMap: Record<string, string> = {
    edu: '교육용자료',
    class: '학급운영자료',
    work: '업무/기타 자료',
    etc: '업무/기타 자료'
  };
  const categoryName = categoryMap[material.category] || '기타자료';

  const isAuthor = user && user.id === material.author_id;

  return (
    <div className={`fade-in ${styles.container}`}>
      <Link href="/" className={styles.backBtn}>
        <ChevronLeft size={20} />
        목록으로 돌아가기
      </Link>

      <div className={`glass ${styles.detailCard}`}>
        <div className={styles.contentArea}>
          <div className={styles.header}>
            <span className={styles.categoryBadge}>{categoryName}</span>
            <h1 className={styles.title}>{material.title}</h1>
            <div className={styles.meta}>
              <span>등록일: {new Date(material.created_at).toLocaleDateString()}</span>
            </div>
          </div>

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

          {isAuthor && (
            <div className={styles.adminActions}>
              <Link href={`/admin/edit/${material.id}`} className={styles.editBtn}>
                <Edit2 size={16} /> 수정하기
              </Link>
              <button onClick={handleDelete} className={styles.deleteBtn}>
                <Trash2 size={16} /> 삭제하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
