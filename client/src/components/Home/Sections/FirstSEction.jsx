import { useEffect, useRef, useState } from "react";
import Brand_Article from "../../Article/Brand_Article";


const FirstSection = () => {
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
            <section ref={rightSlide}>
                <div className={`md:pt-36 sm:pt-24 text-gray-100 sm:mb-10 md:mb-24 xs:py-10 ${visible ? 'animate-slideInRight' : ''}`}>
                    <h1 className="flex md:text-6xl sm:text-4xl xs:text-4xl text-center justify-center">Top Fragrance Brands</h1>
                </div>   
                <Brand_Article/>
            </section>
        </>
    )
}

export default FirstSection;


