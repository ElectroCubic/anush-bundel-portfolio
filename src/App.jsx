import NavBar from "./assets/NavBar/NavBar.jsx"
import HeroSection from "./assets/HeroSection/HeroSection.jsx"
import AboutSection from "./assets/AboutSection/AboutSection.jsx"
import ProjectsSection from "./assets/ProjectsSection/ProjectsSection.jsx"
import SkillsSection from "./assets/SkillsSection/SkillsSection.jsx"
import ContactSection from "./assets/ContactSection/ContactSection.jsx"

import WipBanner from "./assets/WipBanner/WipBanner.jsx"

function App() {
    return(
        <>
            <NavBar />
            <WipBanner />
            <section id="home">
                <HeroSection />
            </section>
            <section id="about">
                <AboutSection />
            </section>
            <section id="projects">
                <ProjectsSection />
            </section>
            <section id="skills">
                <SkillsSection />
            </section>
            <section id="contact">
                <ContactSection />
            </section>
        </>
    );
}
export default App
