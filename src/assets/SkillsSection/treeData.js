export const ROOT_ID = "core";

export const TREE = {
    id: "core",
    label: "",
    type: "core",
    // icon: "/icons/core.svg",
    // desc: "Your foundation.",
    children: [
        {
            id: "python",
            label: "Python",
            icon: "/icons/python.svg",
            desc: "Scripting & tooling.",
            children: [
                { id: "pygame", label: "Pygame", children: [] },
            ],
        },
        {
            id: "git",
            label: "Git",
            children: [
                { id: "github", label: "GitHub", children: [] },
            ],
        },
        {
            id: "gdscript",
            label: "GDScript",
            children: [
                {
                    id: "godot",
                    label: "Godot",
                    children: [
                        { id: "fl", label: "FL Studio", children: [] },
                        {
                            id: "aseprite",
                            label: "Aseprite",
                            children: [
                                { id: "figma", label: "Figma", children: [] },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "vsc",
            label: "VSC",
            children: [
                {
                    id: "html",
                    label: "HTML",
                    children: [
                        {
                            id: "css",
                            label: "CSS",
                            children: [
                                {
                                    id: "js",
                                    label: "JS",
                                    children: [
                                        { id: "react", label: "React", children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "csharp",
                    label: "C#",
                    children: [
                        { id: "unity", label: "Unity", children: [] },
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
    gdscript: { col: 11, row: 4 },
    godot: { col: 13, row: 4 },
    aseprite: { col: 15, row: 4 },
    figma: { col: 17, row: 4 },

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

    gdscript: { col: 6, row: 6 },
    godot: { col: 6, row: 8 },
    fl: { col: 6, row: 12 },
    aseprite: { col: 4, row: 10 },
    figma: { col: 4, row: 12 },

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