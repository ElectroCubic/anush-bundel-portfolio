import PropTypes from "prop-types";
import styles from "./ProjectCard.module.css";
import placeholderPic from "../Placeholder.png";

const TAG_CATEGORY_CLASS = {
    engine: styles.tagEngine,
    tool: styles.tagTool,
    language: styles.tagLang,
    platform: styles.tagPlatform,
    role: styles.tagRole,
    genre: styles.tagGenre,
    type: styles.tagType,
    status: styles.tagStatus,
    misc: styles.tagMisc,
};

const TAG_CATEGORY_BY_NAME = {
    // Types
    "Game Jam": "type",
    Prototype: "type",
    Software: "type",

    // Engines / frameworks
    Godot: "engine",
    Unity: "engine",
    Unreal: "engine",
    React: "tool",

    // Tools
    "FL Studio": "tool",
    Aseprite: "tool",
    Blender: "tool",
    Figma: "tool",
    Git: "tool",

    // Languages
    JavaScript: "language",
    TypeScript: "language",
    Python: "language",
    "C#": "language",
    "C++": "language",
    GDScript: "language",

    // Platforms
    Web: "platform",
    Windows: "platform",
    Android: "platform",

    // Roles
    Programmer: "role",
    Designer: "role",

    // Genres
    Puzzle: "genre",
    Platformer: "genre",
    Roguelike: "genre",

    // Status (optional if you tag it)
    Completed: "status",
    "In Progress": "status",
};

const TYPE_TAG_PRIORITY = ["Game Jam", "Prototype", "Software"];

function getTypeFromTags(tags) {
    if (!Array.isArray(tags) || tags.length === 0) {
        return "Other";
    }

    const tagSet = new Set(tags);

    for (const t of TYPE_TAG_PRIORITY) {
        if (tagSet.has(t)) {
            return t;
        }
    }

    return "Other";
}

function getTypeClass(type) {
    switch (type) {
        case "Game Jam":
            return styles.typeGameJam;
        case "Prototype":
            return styles.typePrototype;
        case "Software":
            return styles.typeSoftware;
        default:
            return styles.typeOther;
    }
}

function normalizeTag(tag) {
    return String(tag || "").trim();
}

function getTagCategory(tag) {
    const name = normalizeTag(tag);
    return TAG_CATEGORY_BY_NAME[name] || "misc";
}

function getTagClass(tag) {
    const category = getTagCategory(tag);
    return TAG_CATEGORY_CLASS[category] || styles.tagMisc;
}

function ProjectCard({
    imgUrl = placeholderPic,
    title = "",
    description = "",
    altDesc = "Project thumbnail",
    tags = [],
}) {
    const type = getTypeFromTags(tags);
    const typeClass = getTypeClass(type);

    return (
        <article className={styles.card}>
            <div className={`${styles.thumbWrap} ${typeClass}`}>
                <img className={styles.thumb} src={imgUrl} alt={altDesc} />
            </div>

            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.desc}>{description}</p>

                <div className={styles.tags}>
                    {tags.map((t) => {
                        const name = normalizeTag(t);
                        if (!name) return null;

                        return (
                            <span
                                key={name}
                                className={`${styles.tag} ${getTagClass(name)}`}
                            >
                                {name}
                            </span>
                        );
                    })}
                </div>

                <button className={styles.cta} type="button">
                    VIEW PROJECT
                </button>
            </div>
        </article>
    );
}

ProjectCard.propTypes = {
    imgUrl: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    altDesc: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectCard