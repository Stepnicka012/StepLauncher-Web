const JSON_URL = "../versions.json";
const latestContainer = document.querySelector(".Update-Latest");
const versionsContainer = document.querySelector(".Versions-Grid");

const order = { stable: 0, beta: 1, alpha: 2, experimental: 3 };
const colors = { stable: "#00ff88", beta: "#ffc107", alpha: "#ff4d4d", experimental: "#7b2cff" };

const getLabel = t => t.charAt(0).toUpperCase() + t.slice(1);

const groupByType = data => {
    return data.reduce((acc, v) => {
        acc[v.type] = acc[v.type] || [];
        acc[v.type].push(v);
        return acc;
    }, {});
};

const renderLatest = (data) => {
    const stables = data.filter(v => v.type === "stable");
    if (!stables.length) return;

    latestContainer.innerHTML = stables.map(v => `
        <div class="Latest-Card-Premium">
            <div class="Badge" style="color: ${colors.stable}; background: ${colors.stable}15">${getLabel(v.type)}</div>
            <div class="Header">
                <img src="../Content/Icons/icon.png">
                <div class="Info">
                    <h1>${v.title}</h1>
                    <span>Release oficial estable</span>
                </div>
            </div>
            <p>${v.description}</p>
            <button class="Primary" data-url="${v.github}">Descargar Ahora</button>
        </div>
    `).join("");
};

const renderAll = (data) => {
    versionsContainer.innerHTML = "";
    const grouped = groupByType(data);

    Object.keys(grouped)
        .sort((a, b) => order[a] - order[b])
        .forEach(type => {
            const section = document.createElement("section");
            section.className = "Version-Section";
            section.innerHTML = `
                <div class="Separator">
                    <div class="Title">
                        <div class="Indicator" style="background: ${colors[type]}; box-shadow: 0 0 15px ${colors[type]}80"></div>
                        <h2>${getLabel(type)}s</h2>
                    </div>
                    <span>${grouped[type].length} disponibles</span>
                </div>
                <div class="Grid">
                    ${grouped[type].map(v => `
                        <div class="Version-Card-Glass">
                            <div class="Top">
                                <h3>${v.title.replace("StepLauncher ", "v")}</h3>
                                <span style="color: ${colors[type]}">${getLabel(type)}</span>
                            </div>
                            <p>${v.description}</p>
                            <div class="Actions">
                                <button class="Secondary" data-url="${v.github}">GitHub Release</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
            versionsContainer.appendChild(section);
        });
};

const attachEvents = () => {
    document.addEventListener("click", e => {
        const btn = e.target.closest("[data-url]");
        if (btn) window.open(btn.dataset.url, "_blank");
    });
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

const init = async () => {
    try {
        const res = await fetch(JSON_URL);
        const data = await res.json();
        const sorted = [...data].sort((a, b) => order[a.type] - order[b.type]);

        renderLatest(sorted);
        renderAll(sorted);
        attachEvents();

        $$(".Version-Card-Glass").forEach(el => observer.observe(el));
    } catch (e) {
        console.error("Error cargando el repositorio de versiones:", e);
    }
};

const $$ = s => document.querySelectorAll(s);

init();