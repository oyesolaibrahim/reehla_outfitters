import { useEffect, useRef, useState } from "react";
import Article_Jalab from "../Article/Article(Jalab)";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


const Male = ({jalabs}) => {
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
            <main className="bg-gray-700 py-10">
            <section ref={rightSlide}>
                <div className={`sm:pt-10 md:pt-36 xs:pt-10  text-white mb-10 ${visible ? 'animate-slideInRight' : ''}`}>
                    <h1 className="flex sm:text-6xl md:text-6xl xs:text-4xl justify-center">Available Male Jalabs</h1>
                </div>   
                <Article_Jalab jalabs={jalabs}/>
            </section>
            </main>
            <Footer/>
        </>
    )
}

export default Male;


