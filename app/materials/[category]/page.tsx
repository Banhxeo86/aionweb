'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ExternalLink } from 'lucide-react';
import styles from './materials.module.css';

const CATEGORIES: Record<string, string> = {
  edu: '교육용자료',
  class: '학급운영자료',
  work: '업무용자료',
  etc: '기타자료',
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = React.use(params);
  const { category } = resolvedParams;
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryName = CATEGORIES[category];

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (!error) {
          // If no data, use some sample data for demonstration
          if (!data || data.length === 0) {
            setMaterials([
              { id: 1, title: `${categoryName} 가이드북`, description: '효율적인 수업을 위한 필수 가이드라인과 매뉴얼입니다.', link_url: '#' },
              { id: 2, title: `${categoryName} 템플릿`, description: '복잡한 업무를 간편하게 처리할 수 있는 문서 양식입니다.', link_url: '#' },
              { id: 3, title: `${categoryName} 활용 사례`, description: '선생님들이 실제로 적용한 생생한 성공 사례 공유.', link_url: '#' },
            ]);
          } else {
            setMaterials(data);
          }
        }
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchMaterials();
    }
  }, [category, categoryName]);

  if (!categoryName) {
    notFound();
  }

  return (
    <div className={`container fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{categoryName}</h1>
        <p className={styles.subtitle}>
          AI-ON 연구회원들이 공유하는 {categoryName}입니다.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>로딩 중...</div>
      ) : (
        <div className={styles.grid}>
          {materials.map((item) => (
            <a 
              key={item.id} 
              href={item.link_url || '#'} 
              target={item.link_url && item.link_url !== '#' ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`glass ${styles.squareCard}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.categoryBadge}>{categoryName.split('자료')[0]}</div>
                <ExternalLink size={18} className={styles.linkIcon} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.viewMore}>자세히 보기 →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
