import styles from './about.module.css';

export default function About() {
  const experiences = [
    {
      category: "SW‧AI",
      items: [
        { year: "2017", text: "학교로 찾아가는 SW교육 연수강사" },
        { year: "2017", text: "교육자료전·교육정보화 연구대회 우수사례 연수 강사" },
        { year: "2018", text: "학교로 찾아가는 SW교육 연수강사" },
        { year: "2019", text: "학교로 찾아가는 SW교육 연수강사" },
        { year: "2021", text: "지역교육청 온오프라인 연계교육 연수강사" },
        { year: "2022", text: "지역교육청 합동연수 SW 활용 교육 연수 강사(AI 활용)" },
        { year: "2023", text: "SW챌린지 우수 지도교사" },
        { year: "2023", text: "교육과학정보원 동계직무연수 연수강사" },
        { year: "2024", text: "교육과학정보원 동계직무연수 연수강사" },
        { year: "2026", text: "AI·디지털 활용 교과연구회" },
        { year: "2026", text: "AI·디지털 선도교원" },
      ]
    },
    {
      category: "STEAM",
      items: [
        { year: "2018", text: "융합교육교과연구회" },
        { year: "2020", text: "STEAM 선도학교" },
        { year: "2023", text: "국립학교 융합형교실(STEAM클럽) 운영" },
        { year: "2024", text: "국립학교 융합형교실(STEAM클럽) 운영" },
        { year: "2025", text: "국립학교 융합형교실(STEAM클럽) 운영(우수 STEAM클럽)" },
      ]
    },
    {
      category: "교육과정 지원",
      items: [
        { year: "2020", text: "도교육청 교육과정 지원단(미래수업)" },
        { year: "2020", text: "지역교육청 원격수업지원 컨설턴트" },
        { year: "2020", text: "지역교육청 원격수업 연구회" },
        { year: "2021", text: "도교육청 교육과정 지원단(미래수업)" },
        { year: "2021", text: "지역교육청 원격수업 연구회" },
        { year: "2024", text: "지역교육청 2022개정교육과정 연수 강사(교과서검토)" },
      ]
    },
    {
      category: "집필 및 자문",
      items: [
        { year: "2021", text: "도교육청 블렌디드 교육과정 자료 집필위원" },
        { year: "2021", text: "도교육청 초·중 전환기 연계교재 집필위원" },
        { year: "2022", text: "한국과학창의재단 전환기 연계교재 자문위원" },
        { year: "2025", text: "디지털 새싹 프로그램 자문위원(강릉원주대학교)" },
        { year: "2025", text: "한국과학창의재단 STEAM클럽 운영 우수사례집" },
        { year: "2026", text: "디지털 새싹 프로그램 개발·자문위원(춘천교육대학교)" },
        { year: "2026", text: "도교육청 초·중 전환기 연계교재 개정본 집필위원" },
      ]
    },
    {
      category: "영재교육",
      items: [
        { year: "2016", text: "지역교육청 영재교육원(초등수학)" },
        { year: "2017", text: "지역교육청 영재교육원(초등수학)" },
        { year: "2018", text: "지역교육청 영재교육원(초등수학)" },
        { year: "2019", text: "교육대학교 발명영재센터(초등발명)" },
        { year: "2020", text: "교육대학교 발명영재센터(초등발명)" },
        { year: "2021", text: "교육대학교 발명영재센터(초등발명)" },
        { year: "2022", text: "지역교육청 영재교육원(초등과학)" },
        { year: "2022", text: "교육대학교 발명영재센터(초등발명)" },
        { year: "2023", text: "지역교육청 영재교육원(중등수학)" },
      ]
    },
    {
      category: "연구대회",
      items: [
        { year: "2013", text: "교육자료전 입상" },
        { year: "2014", text: "교육자료전 입상" },
        { year: "2016", text: "교육정보화연구대회 입상" },
        { year: "2017", text: "교육정보화연구대회 입상" },
        { year: "2019", text: "교육방송연구대회 입상" },
        { year: "2020", text: "과학전람회 입상" },
      ]
    },
    {
      category: "표창",
      items: [
        { year: "2020", text: "교육과정 운영 유공교원 (부총리겸교육부장관표창)" },
      ]
    },
  ];

  return (
    <div className={`container fade-in ${styles.page}`}>
      <section className={styles.header}>
        <h1 className={styles.title}>Career Experience</h1>
      </section>

      <div className={styles.careerGrid}>
        {experiences.map((cat, idx) => (
          <div key={idx} className={`glass ${styles.categoryCard}`}>
            <h2 className={styles.catTitle}>{cat.category}</h2>
            <div className={styles.experienceList}>
              {cat.items.map((item, i) => (
                <div key={i} className={styles.expItem}>
                  <span className={styles.year}>{item.year}</span>
                  <span className={styles.text}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
