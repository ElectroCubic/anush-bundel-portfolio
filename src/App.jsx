import NavBar from "./assets/NavBar/NavBar.jsx"
import HeroSection from "./assets/HeroSection/HeroSection.jsx"
import AboutSection from "./assets/AboutSection/AboutSection.jsx"
import ProjectsSection from "./assets/ProjectsSection/ProjectsSection.jsx"
import SkillsSection from "./assets/SkillsSection/SkillsSection.jsx"

import WipBanner from "./assets/WipBanner/WipBanner.jsx";

function App() {
    return(
        <>
            <NavBar />
            <WipBanner />
            <section id="home" style={{ minHeight: "100vh" }}>
                <HeroSection />
            </section>
            <section id="about" style={{ minHeight: "100vh" }}>
                <AboutSection />
            </section>
            <section id="projects" style={{ minHeight: "100vh" }}>
                <ProjectsSection />
            </section>
            <section id="skills" style={{ minHeight: "100vh" }}>
                <SkillsSection />
            </section>
            <section id="contact" style={{ minHeight: "100vh" }}>
                <h2>Contact</h2>
            </section>
        </>
    );
}
export default App
