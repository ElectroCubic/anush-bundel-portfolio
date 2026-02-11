export const ROOT_ID = "core";

export const TREE = {
    id: "core",
    label: "Core",
    type: "core",
    // icon: "/icons/core.svg",
    desc: "Soft Skills",
    children: [
        {
            id: "python",
            label: "Python",
            icon: "/icons/python.svg",
            desc: "Scripting & tooling.",
            children: [
                { 
                    id: "pygame", 
                    label: "Pygame",
                    icon: "/icons/pygame.svg",
                    desc: "Framework",  
                    children: [] 
                },
            ],
        },
        {
            id: "git",
            label: "Git",
            icon: "/icons/git.svg",
            desc: "git for github",
            children: [
                {   
                    id: "github", 
                    label: "GitHub",
                    icon: "/icons/github.svg",
                    desc: "Version Control", 
                    children: [] 
                },
            ],
        },
        {
            id: "godot",
            label: "Godot",
            icon: "/icons/godot.svg",
            children: [
                {
                    id: "aseprite",
                    label: "Aseprite",
                    icon: "/icons/aseprite.svg",
                    children: [
                        { 
                            id: "fl", 
                            label: "FL Studio",
                            icon: "/icons/flstudio.png", 
                            children: [] 
                        },
                        { 
                            id: "figma", 
                            label: "Figma",
                            icon: "/icons/figma.svg",  
                            children: [
                            { 
                                id: "blender", 
                                label: "Blender",
                                icon: "/icons/blender.svg",  
                                children: [] 
                            },
                        ] },
                    ],
                },
            ],
        },
        {
            id: "vsc",
            label: "VSC",
            icon: "/icons/vscode.svg", 
            children: [
                {
                    id: "html",
                    label: "HTML",
                    icon: "/icons/html5.svg", 
                    children: [
                        {
                            id: "css",
                            label: "CSS",
                            icon: "/icons/css3.svg", 
                            children: [
                                {
                                    id: "js",
                                    label: "JS",
                                    icon: "/icons/javascript.svg", 
                                    children: [
                                        { 
                                            id: "react", 
                                            label: "React",
                                            icon: "/icons/react.svg",  
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
                    children: [
                        { 
                            id: "unity", 
                            label: "Unity",
                            icon: "/icons/unity.svg",  
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