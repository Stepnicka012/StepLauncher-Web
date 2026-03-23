const REPO = "Stepnicka012/StepLauncher";
const API = `https://api.github.com/repos/${REPO}/releases`;

const latestContainer = document.getElementById("update-latest");
const gridContainer = document.getElementById("versions-grid");
const statReleases = document.getElementById("stat-releases");
const statPre = document.getElementById("stat-pre");
const statLatest = document.getElementById("stat-latest");

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("es-AR", {
        year: "numeric", month: "short", day: "numeric"
    });

const truncate = (str = "", max = 180) =>
    str.length > max ? str.slice(0, max).trimEnd() + "…" : str;

const showRateLimitWarning = () => {
    const warningHTML = `
        <div class="Rate-Limit-Warning">
            <div class="Icon">⏳</div>
            <div class="Content">
                <h3>Límite de espera alcanzado</h3>
                <p>GitHub ha restringido temporalmente las descargas para tu conexión por exceso de peticiones. Por favor, <strong>intentá de nuevo en unos minutos</strong> o revisá nuestras redes sociales.</p>
                <button class="Secondary" onclick="location.reload()">Reintentar ahora</button>
            </div>
        </div>
    `;
    
    if (latestContainer) latestContainer.innerHTML = warningHTML;
    if (gridContainer) gridContainer.innerHTML = "";
};

const createLatestCard = (rel) => {
    const card = document.createElement("div");
    card.className = "Latest-Card-Premium";
    card.innerHTML = `
        <div class="Badge" style="
            background: rgba(0,200,255,0.08);
            border: 1px solid rgba(0,200,255,0.25);
            color: #00c8ff;">
            Última versión estable
        </div>

        <div class="Header">
            <img src="../Content/Icons/icon.png" alt="StepLauncher icon">
            <div class="Info">
                <h1>${rel.name || rel.tag_name}</h1>
                <span>${formatDate(rel.published_at)}</span>
            </div>
        </div>

        <p>${truncate(rel.body, 220)}</p>

        <div class="Card-Meta">
            <span class="Meta-Tag">Release</span>
            <span class="Meta-Tag">${rel.tag_name}</span>
        </div>

        <button class="Primary" onclick="window.open('${rel.html_url}', '_blank')">
            Ver y Descargar
        </button>
    `;
    return card;
};

const createLatestPreCard = (rel) => {
    const card = document.createElement("div");
    card.className = "Latest-Card-Premium";
    card.innerHTML = `
        <div class="Badge" style="
            background: rgba(255,170,0,0.08);
            border: 1px solid rgba(255,170,0,0.25);
            color: #ffaa00;">
            Última PreRelease
        </div>

        <div class="Header">
            <img src="../Content/Icons/icon.png" alt="StepLauncher icon">
            <div class="Info">
                <h1>${rel.name || rel.tag_name}</h1>
                <span>${formatDate(rel.published_at)}</span>
            </div>
        </div>

        <p>${truncate(rel.body, 220)}</p>

        <div class="Card-Meta">
            <span class="Meta-Tag">PreRelease</span>
            <span class="Meta-Tag">${rel.tag_name}</span>
        </div>

        <button class="Primary" onclick="window.open('${rel.html_url}', '_blank')"
            style="background: linear-gradient(90deg,#ffaa00,#ff5500);
                   box-shadow: 0 8px 22px rgba(255,100,0,0.25);">
            Ver PreRelease
        </button>
    `;
    return card;
};

const TYPE_STYLE = {
    release: {
        color: "#00c8ff",
        bg: "rgba(0,200,255,0.1)",
        label: "Release"
    },
    prerelease: {
        color: "#ffaa00",
        bg: "rgba(255,170,0,0.1)",
        label: "PreRelease"
    }
};

const createCard = (rel, type) => {
    const s = TYPE_STYLE[type];
    const card = document.createElement("div");
    card.className = "Version-Card-Glass";
    card.innerHTML = `
        <div class="Top">
            <h3>${rel.name || rel.tag_name}</h3>
            <span class="Type-Badge"
                  style="color:${s.color};background:${s.bg};border:1px solid ${s.color}33;">
                ${s.label}
            </span>
        </div>

        <span class="Date">${formatDate(rel.published_at)}</span>

        <p>${truncate(rel.body, 140)}</p>

        <div class="Actions">
            <button class="Secondary"
                    onclick="window.open('${rel.html_url}', '_blank')">
                Ver / Descargar
            </button>
        </div>
    `;
    return card;
};

const createSection = (title, type, list) => {
    if (!list.length) return null;

    const indicatorColor = type === "release" ? "#00c8ff" : "#ffaa00";

    const section = document.createElement("div");
    section.className = "Version-Section";
    section.innerHTML = `
        <div class="Separator">
            <div class="Title">
                <div class="Indicator" style="background:${indicatorColor};
                     box-shadow:0 0 8px ${indicatorColor}88;"></div>
                <h2>${title}</h2>
            </div>
            <span class="Count-Badge">${list.length} versión${list.length !== 1 ? "es" : ""}</span>
        </div>
        <div class="Grid"></div>
    `;

    const grid = section.querySelector(".Grid");
    list.forEach(r => grid.appendChild(createCard(r, type)));

    return section;
};

const animateCards = () => {
    const cards = document.querySelectorAll(".Version-Card-Glass");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("show");
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    cards.forEach(c => observer.observe(c));
};

const initGravityBlocks = () => {
    const container = document.getElementById("gravity-updates");
    if (!container) return;

    const blockNames = [
        "Stone.png", "Dirt.png", "Grass.png", "Diamond_Block.png", "Gold_Block.png",
        "Crafting_Table.png", "Furnace.png", "TNT.png", "Obsidian.png", "Sand.png",
        "Redstone_Block.png", "Emerald_Block.png", "Coal_Block.png", "Glass.png",
        "Glowstone.png", "Bookshelf.png", "Brick.png", "Chest.png", "End_Stone.png"
    ];

    const loadedImages = blockNames.map(name => {
        const img = new Image();
        img.src = `../Content/Others/Blocks/${name}`;
        return img;
    });

    let active = true;

    const createBlock = () => {
        if (!active || container.children.length > 35) return;

        const img = document.createElement("img");
        img.src = loadedImages[Math.floor(Math.random() * loadedImages.length)].src;
        img.alt = "";

        const layerRand = Math.random();
        let speed = 1;
        if (layerRand < 0.33) { img.classList.add("layer-back"); speed = 1.8; }
        else if (layerRand < 0.66) { img.classList.add("layer-mid"); speed = 1.2; }
        else { img.classList.add("layer-front"); speed = 0.8; }

        img.style.left = `${Math.random() * 100}vw`;
        const size = 24 + Math.random() * 36;
        img.style.width = img.style.height = `${size}px`;
        img.style.setProperty("--driftX", `${(Math.random() - 0.5) * 180}px`);

        const duration = (5 + Math.random() * 6) * speed;
        const shouldFloat = Math.random() < 0.12;

        if (shouldFloat) {
            img.style.top = `${Math.random() * 100}vh`;
            img.style.animation = `spaceFloat ${3 + Math.random() * 4}s ease-in-out infinite`;
        } else {
            img.style.animation = `spaceFall ${duration}s linear forwards`;
        }

        container.appendChild(img);
        setTimeout(() => img.remove(), shouldFloat ? 18000 : duration * 1000);
    };

    const loop = () => { createBlock(); setTimeout(loop, 350); };
    loop();

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => active = e.isIntersecting);
    });
    obs.observe(container);
};

const loadReleases = async () => {
    try {
        const res = await fetch(API);
        
        // Si GitHub nos bloquea por Rate Limit (403)
        if (res.status === 403) {
            showRateLimitWarning();
            return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada");

        const releases = data.sort(
            (a, b) => new Date(b.published_at) - new Date(a.published_at)
        );

        const stable = releases.filter(r => !r.prerelease);
        const pre = releases.filter(r => r.prerelease);

        if (statReleases) statReleases.textContent = stable.length;
        if (statPre) statPre.textContent = pre.length;
        if (statLatest && stable[0]) statLatest.textContent = stable[0].tag_name;

        latestContainer.innerHTML = ""; // Limpiar antes de agregar
        if (stable[0]) latestContainer.appendChild(createLatestCard(stable[0]));
        if (pre[0]) latestContainer.appendChild(createLatestPreCard(pre[0]));

        const secStable = createSection("Releases", "release", stable);
        const secPre = createSection("PreReleases", "prerelease", pre);

        if (secStable) gridContainer.appendChild(secStable);
        if (secPre) gridContainer.appendChild(secPre);

        animateCards();

    } catch (err) {
        console.error("[Update.js] Error:", err);
        showRateLimitWarning(); // Usamos el aviso también para errores genéricos
    }
};

initGravityBlocks();
loadReleases();
