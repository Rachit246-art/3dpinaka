const fs = require('fs');

const htmlFiles = [
    'index.html', 'products.html', 'cart.html', 'materials.html', 'support.html',
    'anycubic.html', 'bambu.html', 'creality.html', 'snapmaker.html', 'rotrics.html',
    '3dmakerpro.html', 'flsun.html', 'sunlu.html', 'zortrax.html', 'esun.html',
    'zmorph.html', 'hotrios.html', 'modix.html'
];

const bottomNavHtml = `
    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav">
        <a href="index.html" class="mobile-nav-item active">
            <i class="ph ph-squares-four"></i>
            <span>Home</span>
        </a>
        <a href="login.html" class="mobile-nav-item">
            <i class="ph ph-user"></i>
            <span>Account</span>
        </a>
        <a href="products.html" class="mobile-nav-item">
            <i class="ph ph-storefront"></i>
            <span>Products</span>
        </a>
        <a href="javascript:void(0)" class="mobile-nav-item">
            <div class="mobile-nav-icon-wrap">
                <i class="ph ph-heart"></i>
                <span class="mobile-nav-badge">0</span>
            </div>
            <span>Wishlist</span>
        </a>
        <a href="cart.html" class="mobile-nav-item">
            <div class="mobile-nav-icon-wrap">
                <i class="ph ph-shopping-bag"></i>
                <span class="mobile-nav-badge">0</span>
            </div>
            <span>Cart</span>
        </a>
    </nav>
`;

for (const file of htmlFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if we already injected it
    if (!content.includes('mobile-bottom-nav')) {
        // Insert right before script tag or body closing
        content = content.replace('<script src="js/main.js"></script>', bottomNavHtml + '\n    <script src="js/main.js"></script>');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
}
