const cookieData = [
    {
        name: "Palestine Cookie",
        description: "White chocolate, dark chocolate, and organic pecans. It's a contrast thing—creamy meets bitter, smooth meets crunchy. The organic pecans add that toasted, buttery depth while the two chocolates balance each other out. Rich without being over the top, and honestly just really good if you're into that sweet-nutty-chocolatey situation.",
        ingredients: ["Gluten-free flour mix (rice flour, whole grain brown rice flour, sorghum flour, tapioca starch, potato starch, cellulose, vitamin and mineral blend, xanthan gum, cellulose gum)", "Non GMO white chocolate", "Non GMO dark chocolate", "Plant butter", "Organic cane sugar", "Organic brown sugar", "Organic pasture-raised egg", "Non-alcoholic vanilla extract", "Organic corn starch", "Baking soda", "Organic baking powder", "Organic pecans"],
        image: "assets/dallas.png"
    },
    {
        name: "Oman Cookie",
        description: "Organic cardamom-spiced and dipped in white chocolate. It's warm and aromatic with that slightly floral, citrusy thing organic cardamom does, then covered in smooth white chocolate that mellows it all out. Kind of unexpected but in a way that works. if you're into spiced cookies, this one hits all the notes.",
        ingredients: ["Gluten-free flour mix (rice flour, whole grain brown rice flour, sorghum flour, tapioca starch, potato starch, cellulose, vitamin and mineral blend, xanthan gum, cellulose gum)", "Organic almond flour", "Organic cane sugar", "Organic cardamom", "Salt", "Organic baking powder", "Organic pasture-raised egg", "Organic avocado oil"],
        image: "assets/oman.PNG"
    },
    {
        name: "Dubai Cookie",
        description: "Pistachios on pistachios—loaded throughout, stuffed with pistachio paste in the center, then hit with dark chocolate. It's nutty, a little earthy, with that dark chocolate edge to keep it from being too sweet. Rich, intense, unapologetically green.",
        ingredients: ["Pistachio cream (Non GMO white chocolate, pistachio, organic cane sugar)", "Plant butter", "Organic cane sugar", "Organic brown sugar", "Organic pasture-raised egg", "Non-alcoholic vanilla extract", "Organic corn starch", "Baking soda", "Organic baking powder", "Non GMO dark chocolate", "Organic pistachios", "Gluten-free flour mix (rice flour, whole grain brown rice flour, sorghum flour, tapioca starch, potato starch, cellulose, vitamin and mineral blend, xanthan gum, cellulose gum)"],
        image: "assets/dubai.png"
    },
    {
        name: "Damascus Cookie",
        description: "Straight-up lemon. Like, actually lemony—not just a hint. It's a crinkle cookie, so you get that crispy-chewy texture, but the real thing here is how bright and tart it is. Citrus fans only. If you're looking for something that cuts through the sweetness and wakes up your taste buds, this is the move.",
        ingredients: ["Gluten-free cake mix (organic cane sugar, tapioca starch, rice flour, organic corn starch, emulsifier, organic baking powder, salt, vanilla, xanthan gum)", "Organic lemon oil (lemon, sunflower oil)", "Organic avocado oil", "Organic pasture-raised egg"],
        image: "assets/damascus.png"
    },
    {
        name: "Cairo Cookie",
        description: "Dark chocolate cookie loaded with white, dark, and milk chocolate chips, stuffed with marshmallow in the middle. It's basically a s'mores situation but make it a cookie. You get that gooey center, all three chocolates doing their thing, and it's rich without being one-note. For when you want dessert to feel like an actual experience and not just a snack.",
        ingredients: ["Gluten-free flour mix (rice flour, whole grain brown rice flour, sorghum flour, tapioca starch, potato starch, cellulose, vitamin and mineral blend, xanthan gum, cellulose gum)", "Organic cocoa powder", "Salt", "Organic baking powder", "Plant butter", "Organic brown sugar", "Organic cane sugar", "Organic pasture-raised egg", "Non-alcoholic vanilla", "Non GMO white chocolate chips", "Non GMO milk chocolate chips", "Non GMO dark chocolate chips", "Marshmallow (tapioca syrup, organic cane sugar, water, tapioca starch, carrageenan, soy protein, vanilla flavor)"],
        image: "assets/peru.png",
        comingSoon: true,
    },
    {
        name: "Tangier Cookie",
        description: "Ginger on ginger—a spiced ginger base with chopped ginger cookies folded in, plus white chocolate to balance the heat. It's warm, a little sharp, with that tingly ginger bite that actually means business. The white chocolate keeps it from being too intense but doesn't kill the vibe. If you like your cookies with some kick and actual spice, not just sweetness, this one's it.",
        ingredients: ["Honey cinnamon cookies (watermelon flour, cashew flour, sunflower seeds, flax seeds, arrowroot, coconut sugar, coconut oil, honey, honey extract, rosemary extract, sea salt, cream of tartar, vanilla extract)", "Organic cinnamon", "Organic ginger", "Evaporated coconut milk", "Organic brown sugar", "Plant butter", "Non GMO vegan white chocolate", "Organic cane sugar", "Organic pasture-raised egg", "Non-alcoholic vanilla", "Baking soda", "Salt", "Gluten-free flour blend (rice flour, whole grain brown rice flour, sorghum flour, tapioca starch, potato starch, cellulose, vitamin and mineral blend, xanthan gum, cellulose gum)"],
        image: "assets/tangier.png"
    },
    {
        name: "Jenin Cookie",
        description: "Slivered almonds, shredded coconut, and white chocolate chips. It's textured—crunchy, chewy, with that toasted coconut-almond thing happening. Kind of tropical but not in an over-the-top way, just nutty and sweet with good contrast. If you're into cookies that aren't just soft and one-dimensional, this has actual bite to it.",
        ingredients: ["Gluten-free flour mix (rice flour, whole grain brown rice flour, sorghum flour, tapioca starch, potato starch, cellulose, vitamin and mineral blend, xanthan gum, cellulose gum)", "Plant butter", "Organic cane sugar", "Organic brown sugar", "Organic pasture-raised egg", "Non-alcoholic vanilla extract", "Baking soda", "Salt", "Non GMO chocolate chips", "Organic coconut", "Organic almonds"],
        image: "assets/jenin.PNG"
    }
];

function renderCookieMenu() {
    const menuContainer = document.getElementById('cookie-menu');
    if (!menuContainer) return;

    cookieData.forEach((cookie, index) => {
        const cookieCard = createCookieCard(cookie, index);
        menuContainer.appendChild(cookieCard);
    });

    setupLazyLoading();
}

function createCookieCard(cookie, index) {
    const card = document.createElement('article');
    card.className = cookie.comingSoon ? 'cookie-card coming-soon' : 'cookie-card';
    card.setAttribute('role', 'listitem');

    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="cookie-card-inner">
            <div class="cookie-image">
                ${cookie.comingSoon ? '<div class="coming-soon-overlay">Coming Soon</div>' : ''}
                <img data-src="${cookie.image}" alt="${cookie.name}" loading="lazy">
            </div>
            <div class="cookie-content">
                <h3 class="cookie-name">${cookie.name}</h3>
                <p class="cookie-description">${cookie.description}</p>
                <div class="cookie-actions">
                    <button 
                        class="ingredients-toggle" 
                        aria-expanded="false" 
                        aria-controls="ingredients-${index}"
                        type="button"
                    >
                        <span>View Ingredients</span>
                        <span class="toggle-icon" aria-hidden="true">▼</span>
                    </button>
                    <a href="order.html" class="order-now-btn">Order Now</a>
                </div>
                <div id="ingredients-${index}" class="ingredients-content" role="region" aria-label="Ingredients for ${cookie.name}">
                    <ul class="ingredients-list">
                        ${cookie.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    const toggleBtn = card.querySelector('.ingredients-toggle');
    const content = card.querySelector('.ingredients-content');

    toggleBtn.addEventListener('click', () => {
        toggleIngredients(toggleBtn, content);
    });

    return card;
}

function toggleIngredients(button, content) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', !isExpanded);
    content.classList.toggle('expanded');

    const buttonText = button.querySelector('span:first-child');
    buttonText.textContent = isExpanded ? 'View Ingredients' : 'Hide Ingredients';
}

function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');

                if (src) {
                    img.src = src;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    img.addEventListener('error', () => {
                        console.warn(`Failed to load image: ${src}`);
                    });
                }

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function updateNextEvent(eventName, eventDate, eventLocation) {
    const nameEl = document.querySelector('.event-name');
    const dateEl = document.querySelector('.event-date');
    const locationEl = document.querySelector('.event-location');

    if (nameEl) nameEl.textContent = eventName;
    if (dateEl) dateEl.textContent = eventDate;
    if (locationEl) locationEl.textContent = eventLocation;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCookieMenu();
    setupSmoothScroll();

});

function addEntranceAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.cookie-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

setTimeout(addEntranceAnimations, 100);