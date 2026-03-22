class StaticLight {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.config = {
            blur: options.blur ?? 80,
            brightness: options.brightness ?? 1.2,
            saturation: options.saturation ?? 1.3,
            opacity: options.opacity ?? 0.6,
            scale: options.scale ?? 0.1,
            zIndex: options.zIndex ?? -1,
            transitionDuration: options.transitionDuration ?? 1000,
            useCustomContainer: options.useCustomContainer ?? false,
            customContainer: options.customContainer ?? null
        };

        this.canvases = [];
        this.ctxs = [];
        this.activeIndex = 0;
        this.init();
    }

    init() {
        this.container = this.config.useCustomContainer && this.config.customContainer 
            ? this.config.customContainer 
            : document.getElementById(this.containerId);

        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }

        for (let i = 0; i < 2; i++) {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                z-index: ${this.config.zIndex};
                pointer-events: none;
                filter: blur(${this.config.blur}px) brightness(${this.config.brightness}) saturate(${this.config.saturation});
                opacity: 0;
                transition: opacity ${this.config.transitionDuration}ms ease-in-out;
                will-change: opacity;
            `;
            this.canvases.push(canvas);
            this.ctxs.push(canvas.getContext('2d', { alpha: false }));
            this.container.appendChild(canvas);
        }
    }

    setImage(source) {
        const img = source instanceof HTMLImageElement ? source : new Image();
        if (typeof source === 'string') img.src = source;

        if (img.complete) {
            this.processTransition(img);
        } else {
            img.onload = () => this.processTransition(img);
        }
    }

    processTransition(img) {
        const nextIndex = 1 - this.activeIndex;
        const nextCanvas = this.canvases[nextIndex];
        const nextCtx = this.ctxs[nextIndex];

        const w = Math.floor(img.naturalWidth * this.config.scale);
        const h = Math.floor(img.naturalHeight * this.config.scale);
        
        if (nextCanvas.width !== w || nextCanvas.height !== h) {
            nextCanvas.width = w;
            nextCanvas.height = h;
        }
        
        nextCtx.drawImage(img, 0, 0, w, h);

        nextCanvas.style.opacity = this.config.opacity;
        this.canvases[this.activeIndex].style.opacity = 0;

        this.activeIndex = nextIndex;
    }

    updateStyle() {
        this.canvases.forEach(c => {
            c.style.filter = `blur(${this.config.blur}px) brightness(${this.config.brightness}) saturate(${this.config.saturation})`;
        });
    }
}

export default StaticLight;