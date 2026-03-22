import './Promo.js';
import StaticLight from './StaticLight.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let currentIndex = 0;
const imagePaths = [
    "./Content/StepLauncher/MainMenu.png",
    "./Content/Defaults/cape1.png",
    "./Content/Background/0.png"
];

const containerFather = $(".Images-Preview-Container");
const imagesContainer = $(".Preview-Images");
const cards = $$(".Experience-Card");
const nextBtn = $(".Next-Button");
const backBtn = $(".Back-Button");

let images = [];

const ambientLight = new StaticLight(imagesContainer.id, {
    blur: 100,
    canvasBlur: 15,
    useCustomContainer: true,
    customContainer: containerFather,
    brightness: 1.2,
    saturation: 1.3,
    opacity: 0.6,
    scale: 0.1,
    transitionDuration: 1200,
    fadeInDuration: 800
});

function createImage(index) {
    if (images[index]) return;
    
    const img = new Image();
    img.src = imagePaths[index];
    img.loading = "lazy";
    img.decoding = "async";
    
    Object.assign(img.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        transition: "transform 0.5s ease"
    });
    
    imagesContainer.appendChild(img);
    images[index] = img;
}

function updateSlider() {
    createImage(currentIndex);
    
    if (images[currentIndex]) {
        ambientLight.setImage(images[currentIndex]);
    }
    
    images.forEach((img, i) => {
        if (img) img.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
    });
}

cards.forEach((card, index) => {
    card.onclick = () => {
        currentIndex = index;
        updateSlider();
    };
});

backBtn.onclick = () => {
    if (currentIndex < imagePaths.length - 1) {
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
        if (entry.isIntersecting) entry.target.classList.add("show");
    });
}, { threshold: 0.2 });

$$(".Card-Section-Everything").forEach(el => observer.observe(el));

updateSlider();

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

let active = false;
const observerBlocks = new IntersectionObserver(entries => {
    entries.forEach(entry => active = entry.isIntersecting);
});
observerBlocks.observe(container);

function createBlock() {
    if (container.children.length > 40) return;
    
    const img = document.createElement("img");
    const randomImg = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    img.src = randomImg.src;
    
    const layerRand = Math.random();
    let speedMultiplier = 1;
    if(layerRand < 0.33){ img.classList.add("layer-back"); speedMultiplier = 1.8; }
    else if(layerRand < 0.66){ img.classList.add("layer-mid"); speedMultiplier = 1.2; }
    else{ img.classList.add("layer-front"); speedMultiplier = 0.8; }
    
    img.style.left = Math.random() * 100 + "vw";
    const size = 24 + Math.random() * 40;
    img.style.width = img.style.height = size + "px";
    img.style.setProperty("--driftX", (Math.random() - 0.5) * 200 + "px");
    
    const duration = (6 + Math.random() * 6) * speedMultiplier;
    const shouldFloat = Math.random() < 0.15;
    
    if(shouldFloat){
        img.style.top = Math.random() * 100 + "vh";
        img.style.animation = `spaceFloat ${3 + Math.random() * 4}s ease-in-out infinite`;
    } else {
        img.style.animation = `spaceFall ${duration}s linear forwards`;
    }
    
    container.appendChild(img);
    setTimeout(() => { if(img.parentNode) img.remove(); }, shouldFloat ? 20000 : duration * 1000);
}

function spawnLoop() {
    if(active) createBlock();
    setTimeout(spawnLoop, 300);
}
spawnLoop();

const BASE_PATH = "./Content/Others/Minecraft Banners Versions/";
const TOTAL = 16;

function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createImg(src){
    const wrapper = document.createElement("div");
    wrapper.className = "Banner-Wrapper";
    
    const spinner = document.createElement("div");
    spinner.className = "Spinner";
    wrapper.appendChild(spinner);
    
    const img = new Image();
    img.src = src;
    img.loading = "eager";
    img.decoding = "async";
    
    img.onload = () => {
        wrapper.replaceChild(img, spinner);
    };
    
    wrapper.appendChild(img);
    return wrapper;
}

async function loadTrack(container){
    let order = shuffle(Array.from({length: TOTAL}, (_, i) => i+1));
    const promises = order.map(i => {
        return new Promise(res => {
            const wrapper = createImg(BASE_PATH + i + ".png");
            wrapper.querySelector("img").onload = () => res(wrapper);
        });
    });
    
    const imgs = await Promise.all(promises);
    for(let i=0;i<3;i++) imgs.forEach(img => container.appendChild(img.cloneNode(true)));
    startInfiniteScroll(container);
}

function startInfiniteScroll(container){
    let speed = 0.5;
    let pos = 0;
    function loop(){
        pos += speed;
        if(pos >= container.scrollWidth / 3) pos = 0;
        container.style.transform = `translateX(-${pos}px)`;
        requestAnimationFrame(loop);
    }
    loop();
}

$$(".Playing-All-Versions .Images .Track").forEach(loadTrack);

const containeruser = $(".Grid-Users");
const getFavicon = url => {
    try{ return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`; }
    catch{ return ""; }
};
const getLinkClass = url => url.includes("youtube") ? "yt" : url.includes("twitch") ? "tw" : "web";
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
        const res = await fetch("https://bvcrytgetpzniqfqdsng.supabase.co/storage/v1/object/public/json/coments.json");
        if(!res.ok) throw new Error("No se pudo cargar el JSON");
        const data = await res.json();
        containeruser.innerHTML = "";
        data.forEach(user => containeruser.appendChild(createCard(user)));
    }catch(err){
        console.error(err);
        containeruser.innerHTML = "<p>Error cargando usuarios</p>";
    }
};

const optimizeGlobalImages = () => {
    const allImages = document.querySelectorAll('img');
    
    const processor = async (img) => {
        if (img.complete) return;
        
        img.style.opacity = "0";
        img.style.transition = "opacity 0.5s ease-in-out";
        
        try {
            await img.decode();
            img.style.opacity = "1";
        } catch (e) {
            img.style.opacity = "1";
        }
    };

    allImages.forEach(img => processor(img));

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') processor(node);
                if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(img => processor(img));
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

optimizeGlobalImages();
loadUsers();