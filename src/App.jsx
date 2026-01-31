
import NavBar from "./assets/NavBar/NavBar.jsx"
import HeroSection from "./assets/HeroSection/HeroSection.jsx"

function App() {
    return(
        <>
            <NavBar />
            <section id="home" style={{ minHeight: "100vh" }}>
                <HeroSection />
            </section>
            <section id="about" style={{ minHeight: "100vh" }}>
                <h2>About</h2>
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
