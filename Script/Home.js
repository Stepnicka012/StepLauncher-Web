import './Promo.js';
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let currentIndex = 0;

const images = $$(".Preview-Images img:not(button img)");
const cards = $$(".Experience-Card");
const nextBtn = $(".Next-Button");
const backBtn = $(".Back-Button");

images.forEach(img => {
    Object.assign(img.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        transition: "transform 0.5s ease"
    });
});

function updateSlider() {
    images.forEach((img, i) => {
        img.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
    });
}

cards.forEach((card, index) => {
    card.onclick = () => {
        currentIndex = index;
        updateSlider();
    };
});

backBtn.onclick = () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateSlider();
    }
};

nextBtn.onclick = () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

$$(".Card-Section-Everything").forEach(el => observer.observe(el));

const container = $(".Gravity-Blocks");

const blockNames = [
    "Stone.png","Dirt.png","Grass.png","Diamond_Block.png","Gold_Block.png",
    "Crafting_Table.png","Furnace.png","TNT.png","Obsidian.png","Sand.png",
    "Redstone_Block.png","Emerald_Block.png","Coal_Block.png","Glass.png",
    "Glowstone.png","Bookshelf.png","Brick.png","Chest.png","End_Stone.png"
];

const loadedImages = blockNames.map(name => {
    const img = new Image();
    img.src = `./Content/Others/Blocks/${name}`;
    return img;
});

function createBlock() {
    if (container.children.length > 40) return;

    const img = document.createElement("img");
    const randomImg = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    img.src = randomImg.src;

    const layerRand = Math.random();
    let speedMultiplier = 1;

    if (layerRand < 0.33) {
        img.classList.add("layer-back");
        speedMultiplier = 1.8;
    } else if (layerRand < 0.66) {
        img.classList.add("layer-mid");
        speedMultiplier = 1.2;
    } else {
        img.classList.add("layer-front");
        speedMultiplier = 0.8;
    }

    img.style.left = Math.random() * 100 + "vw";

    const size = 24 + Math.random() * 40;
    img.style.width = size + "px";
    img.style.height = size + "px";

    img.style.setProperty("--driftX", (Math.random() - 0.5) * 200 + "px");

    const duration = (6 + Math.random() * 6) * speedMultiplier;
    const shouldFloat = Math.random() < 0.15;

    if (shouldFloat) {
        img.style.top = Math.random() * 100 + "vh";
        img.style.animation = `spaceFloat ${3 + Math.random() * 4}s ease-in-out infinite`;
    } else {
        img.style.animation = `spaceFall ${duration}s linear forwards`;
    }

    container.appendChild(img);

    const lifeTime = shouldFloat ? 20000 : duration * 1000;

    setTimeout(() => {
        if (img.parentNode) img.remove();
    }, lifeTime);
}

let active = false;

const observerBlocks = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        active = entry.isIntersecting;
    });
});

observerBlocks.observe(container);

function spawnLoop() {
    if(active) createBlock();
    setTimeout(spawnLoop, 300);
}

spawnLoop();
const BASE_PATH = "./Content/Others/Minecraft Banners Versions/";
const TOTAL = 16;

function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createImg(src){
    const img = new Image();
    img.src = src;
    img.loading = "eager";
    img.decoding = "auto";
    return img;
}

async function loadTrack(container){
    let order = shuffle(Array.from({length: TOTAL}, (_, i) => i + 1));
    const promises = order.map(i => {
        return new Promise(res => {
            const img = createImg(BASE_PATH + i + ".png");
            img.onload = () => res(img);
        });
    });

    const imgs = await Promise.all(promises);

    for(let i = 0; i < 3; i++){
        imgs.forEach(img => container.appendChild(img.cloneNode()));
    }

    startInfiniteScroll(container);
}

function startInfiniteScroll(container){
    let speed = .5;
    let pos = 0;

    function loop(){
        pos += speed;

        if(pos >= container.scrollWidth / 3){
            pos = 0;
        }

        container.style.transform = `translateX(-${pos}px)`;

        requestAnimationFrame(loop);
    }

    loop();
}

$$(".Playing-All-Versions .Images .Track").forEach(loadTrack);
const containeruser = document.querySelector(".Grid-Users");

const getFavicon = url => {
    try{
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    }catch{
        return "";
    }
};

const getLinkClass = url => {
    if(url.includes("youtube")) return "yt";
    if(url.includes("twitch")) return "tw";
    return "web";
};

const renderStars = n => "★★★★★".slice(0,n) + "☆☆☆☆☆".slice(n,5);

const createCard = user => {
    const avatar = user.avatar || `./Content/Icons/User.svg`;

    const actions = (user["links-externals"] || []).map(link => `
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="${getLinkClass(link)}">
            <img src="${getFavicon(link)}" loading="lazy" decoding="async">
        </a>
    `).join("");

    const card = document.createElement("div");
    card.className = "User-Card";

    card.innerHTML = `
        <div class="Header">
            <div class="Avatar" style="background-image:url('${avatar}')"></div>
            <div class="User-Info">
                <h1>${user.username}</h1>
                <span>${user["user-type"]}</span>
            </div>
        </div>

        <div class="Body">${user.body}</div>

        <div class="Footer-User">
            <div class="Stars">${renderStars(user.stars)}</div>
            <div class="Actions">${actions}</div>
        </div>
    `;

    return card;
};

const loadUsers = async () => {
    try{
        // const res = await fetch('../coments.json');
        const res = await fetch("https://bvcrytgetpzniqfqdsng.supabase.co/storage/v1/object/public/json/coments.json");
        if(!res.ok) throw new Error("No se pudo cargar el JSON");

        const data = await res.json();

        containeruser.innerHTML = "";
        data.forEach(user => {
            containeruser.appendChild(createCard(user));
        });

    }catch(err){
        console.error(err);
        containeruser.innerHTML = "<p>Error cargando usuarios</p>";
    }
};

loadUsers();
updateSlider();