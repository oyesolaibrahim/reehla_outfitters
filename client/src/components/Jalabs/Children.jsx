import { useEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ChildrenArticle from "../Article/ChildrenArticle";


const Children = ({childrenJalabs}) => {
const [visible, setVisible] = useState(false);
const rightSlide = useRef(null);

useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Right Element is in view');
            entry.target.classList.add("animate-slideInRight");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
  
    if (rightSlide.current) {
      observer.observe(rightSlide.current);
    }
  
    return () => {
      if (rightSlide.current) {
        observer.unobserve(rightSlide.current);
      }
    };
  }, []);
  

    return (
        <>  
        <Header/>
        <main className="bg-gray-700 pb-16">
            <section ref={rightSlide}>
                <div className={`py-10 text-white mb-10 ${visible ? 'animate-slideInRight' : ''}`}>
                    <h1 className="flex sm:text-6xl md:text-6xl xs:text-4xl justify-center">Available Children Jalabs</h1>
                </div>   
                <ChildrenArticle childrenJalabs={childrenJalabs}/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default Children;


