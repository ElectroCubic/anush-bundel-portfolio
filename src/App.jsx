
import NavBar from "./assets/NavBar/NavBar.jsx"
import HeroSection from "./assets/HeroSection/HeroSection.jsx"
import AboutSection from "./assets/AboutSection/AboutSection.jsx";

function App() {
    return(
        <>
            <NavBar />
            <section id="home">
                <HeroSection />
            </section>
            <section id="about">
                <AboutSection />
            </section>
            <section id="projects" style={{ minHeight: "100vh" }}>
                <h2>Projects</h2>
            </section>
            <section id="skills" style={{ minHeight: "100vh" }}>
                <h2>Skills</h2>
            </section>
            <section id="contact" style={{ minHeight: "100vh" }}>
                <h2>Contact</h2>
            </section>
        </>
    );
}
export default App
