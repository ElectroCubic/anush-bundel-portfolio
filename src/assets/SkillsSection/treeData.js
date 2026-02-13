export const ROOT_ID = "core";

export const TREE = {
    id: "core",
    label: "Core Skills",
    type: "core",
    icon: "/icons/cog.svg",
    desc: "Strong foundation in DSA, OOPS architecture, scalable system design, and real-world problem solving.",
    children: [
        {
            id: "python",
            label: "Python",
            icon: "/icons/python.svg",
            desc: "Scripting, tooling and application development.",
            children: [
                { 
                    id: "pygame", 
                    label: "Pygame",
                    icon: "/icons/pygame.svg",
                    desc: "2D game mechanics, event loops, collision systems, and custom rendering logic.",  
                    children: [] 
                },
            ],
        },
        {
            id: "git",
            label: "Git",
            icon: "/icons/git.svg",
            desc: "Version control, branching, conflict resolution, and collaborative workflows.",
            children: [
                {   
                    id: "github", 
                    label: "GitHub",
                    icon: "/icons/github.svg",
                    desc: "Project hosting, issue tracking, and versioned releases.", 
                    children: [] 
                },
            ],
        },
        {
            id: "godot",
            label: "Godot",
            icon: "/icons/godot.svg",
            desc: "Primary Game Engine for Game architecture, scene systems, scripting, and gameplay logic implementation.",
            children: [
                {
                    id: "aseprite",
                    label: "Aseprite",
                    icon: "/icons/aseprite.svg",
                    desc: "Pixel art creation, animation spritesheets, and asset pipeline optimization.",
                    children: [
                        { 
                            id: "fl", 
                            label: "FL Studio",
                            icon: "/icons/flstudio.png",
                            desc: "Sound design, SFX and BGM composition, and audio production workflows.", 
                            children: [] 
                        },
                        { 
                            id: "figma", 
                            label: "Figma",
                            icon: "/icons/figma.svg",
                            desc: "UI layout systems, component-based design, and interaction prototyping.",  
                            children: [
                            { 
                                id: "blender", 
                                label: "Blender",
                                icon: "/icons/blender.svg",
                                desc: "Basic 3D modeling, asset export pipelines, and low-poly optimization.",  
                                children: [] 
                            },
                        ] },
                    ],
                },
            ],
        },
        {
            id: "vsc",
            label: "VS Code",
            icon: "/icons/vscode.svg",
            desc: "Development environment customization, debugging workflows, and productivity tooling.", 
            children: [
                {
                    id: "html",
                    label: "HTML",
                    icon: "/icons/html5.svg",
                    desc: "Semantic structure, accessibility fundamentals, and SEO-aware markup.", 
                    children: [
                        {
                            id: "css",
                            label: "CSS",
                            icon: "/icons/css3.svg",
                            desc: "Responsive layouts, animations, component styling, and design systems.", 
                            children: [
                                {
                                    id: "js",
                                    label: "JavaScript",
                                    icon: "/icons/javascript.svg",
                                    desc: "Asynchronous logic, DOM manipulation, state handling, and modular architecture.", 
                                    children: [
                                        { 
                                            id: "react", 
                                            label: "React",
                                            icon: "/icons/react.svg",
                                            desc: "Component-based architecture, hooks, state management, and UI composition.",  
                                            children: [] 
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "csharp",
                    label: "C#",
                    icon: "/icons/csharp.svg",
                    desc: "Object-oriented programming, gameplay logic, and engine-level scripting.", 
                    children: [
                        { 
                            id: "unity", 
                            label: "Unity",
                            icon: "/icons/unity.svg",
                            desc: "Scene systems, physics interactions, scripting behaviors, and gameplay systems.",  
                            children: [] 
                        },
                    ],
                },
            ],
        },
    ],
};

export const POS_DESKTOP = {
    core: { col: 9, row: 4, type: "core" },

    pygame: { col: 7, row: 2 },
    python: { col: 9, row: 2 },
    fl: { col: 13, row: 2 },

    github: { col: 5, row: 4 },
    git: { col: 7, row: 4 },
    godot: { col: 11, row: 4 },
    aseprite: { col: 13, row: 4 },
    figma: { col: 15, row: 4 },
    blender: { col: 17, row: 4 },

    react: { col: 1, row: 6 },
    js: { col: 3, row: 6 },
    css: { col: 5, row: 6 },
    html: { col: 7, row: 6 },
    vsc: { col: 9, row: 6 },
    csharp: { col: 11, row: 6 },
    unity: { col: 13, row: 6 },
};

export const POS_MOBILE = {
    core: { col: 4, row: 2, type: "core" },

    python: { col: 6, row: 2 },
    pygame: { col: 6, row: 4 },

    godot: { col: 6, row: 6 },
    fl: { col: 6, row: 12 },
    aseprite: { col: 6, row: 8 },
    figma: { col: 4, row: 10 },
    blender: { col: 4, row: 12 },

    git: { col: 2, row: 2 },
    github: { col: 2, row: 4 },

    vsc: { col: 4, row: 4 },
    html: { col: 2, row: 6 },
    css: { col: 2, row: 8 },
    js: { col: 2, row: 10 },
    react: { col: 2, row: 12 },

    csharp: { col: 4, row: 6 },
    unity: { col: 4, row: 8 },
};