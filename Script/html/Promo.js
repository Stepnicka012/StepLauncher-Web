const container = document.getElementById("promo-container");

const createCard = user => {

    const actions = (user.chanels || []).map(link => `
        <a href="${link}" target="_blank" rel="noopener noreferrer">
            <img src="${getFavicon(link)}" loading="lazy" decoding="async">
        </a>
    `).join("");

    return `
        <div class="Promo-Card">

            <div class="Banner" style="background-image:url('${user.assets.banner}')"></div>

            <div class="Content">

                <div class="Avatar">
                    <img src="${user.assets.avatar}">
                </div>

                <div class="Info">
                    <h1>
                        ${user.usernmae}
                        ${user.verifiqued ? `<span class="Verified">✔</span>` : ""}
                    </h1>
                    <p>${user.id}</p>
                </div>

                <div class="Stats">
                    <div><strong>${user.subs}</strong><span>Subs</span></div>
                    <div><strong>${user.views}</strong><span>Views</span></div>
                </div>

                <div class="Actions">
                    ${actions}
                </div>

            </div>
        </div>
    `;
};
const getFavicon = url => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
        return "";
    }
};
const loadPromos = async () => {
    const res = await fetch("https://bvcrytgetpzniqfqdsng.supabase.co/storage/v1/object/public/json/promos.json");
    const data = await res.json();

    container.innerHTML = data.map(createCard).join("");
};

loadPromos();