import Navbar from '../components/sections/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import SocialFooter from '../components/sections/SocialFooter';

const Home = () => {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 selection:text-white overflow-x-hidden">
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <SocialFooter />
        </div>
    );
};

export default Home;
