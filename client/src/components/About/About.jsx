import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import logo from "../../assets/shared/logo.png"

const About = () => {
    return (
        <>
            <Header/>
            <main className="bg-gray-700 min-h-screen py-10 xs:h-full">
                <div className="bg-red-200 md:w-3/5 xs:w-screen sm:w-screen md:flex m-auto rounded-2xl py-10 px-10">
                    <img src={logo} alt="logo-img"/>
                </div>
            </main>
                
        <Footer/>
        </>
    )

}
export default About;